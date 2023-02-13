import React from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import getRecipientEmail from "../utils/getRecipientEmail";
import { auth, userCollectionRef } from "../firebaseConfig";
import { query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
const Chat = ({ id, users }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const recipientEmail = getRecipientEmail(users, user);
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };
  const recipientRef = query(
    userCollectionRef,
    where("email", "==", recipientEmail)
  );
  const [recipientSnapShot] = useCollection(recipientRef);
  const recipient = recipientSnapShot?.docs?.[0]?.data();
  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  word-break: break-word;
  :hover {
    background-color: #e9eaeb;
  }
  cursor: pointer;
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
