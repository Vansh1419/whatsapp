import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  auth,
  chatCollectionRef,
  database,
  userCollectionRef,
} from "../firebaseConfig";
import {
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { Avatar, IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from "next/router";
import MoreVert from "@mui/icons-material/MoreVert";
import AttachFile from "@mui/icons-material/AttachFile";
import Message from "./Message";
import InsertEmoticon from "@mui/icons-material/InsertEmoticon";
import { Mic } from "@mui/icons-material";
import TimeAgo from "timeago-react";

const ChatScreen = ({ messages, chat }) => {

  const [user] = useAuthState(auth);
  const router = useRouter();
  const recipientEmail = getRecipientEmail(chat.users, user);
  const recipientRef = query(
    userCollectionRef,
    where("email", "==", recipientEmail)
  );

  const [recipientSnapShot] = useCollection(recipientRef);
  const recipient = recipientSnapShot?.docs?.[0]?.data();
  const myDoc = doc(database, "chats", router.query.id);
  const messageCollectionRef = collection(myDoc, "messages");
  const q = query(messageCollectionRef, orderBy("timestamp", "asc"));
  const [messageSnapshot] = useCollection(q);

  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    await setDoc(doc(userCollectionRef, user.uid), {
      lastScreen: serverTimestamp(),
    });
    await addDoc(messageCollectionRef, {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
  };

  const [input, setInput] = useState("");
  ;

  return (
    <Container>
      <Header>
        {recipient ? (
          <UserAvatar src={recipient.photoURL} />
        ) : (
          <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipient ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last Active...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {/* show messages */}
        {showMessages()}
        <EndOfMessage />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticon />
        <Input
          placeholder="Send a Message ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage} />
        <Mic />
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div``;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
const EndOfMessage = styled.div``;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  border-radius: 10px;
  padding: 20px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  outline: none;
  border: none;
  z-index: 100;
  font-size: 16px;
`;
