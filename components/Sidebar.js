import { Avatar, IconButton, Button } from "@mui/material";
import React, { useEffect } from "react";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import { auth, chatCollectionRef } from "../firebaseConfig";
import * as EmailValidator from "email-validator";
import { signOut } from "firebase/auth";
import { addDoc, where, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "../components/Chat";

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const userChatRef = query(
    chatCollectionRef,
    where("users", "array-contains", user.email)
  );
  const [chatShapShot] = useCollection(userChatRef);
  const createChat = async () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );
    chatAlreadyExist(input);
    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      user.email !== input
    ) {
      // we need to add the chat into the DB 'chats' collection if it doesn't already exist and is valid
      await addDoc(chatCollectionRef, {
        users: [user.email, input],
      });
    }
  };
  const chatAlreadyExist = (recipientEmail) =>
    !!chatShapShot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  return (
    <Container>
      <Header>
        {/* <UserAvatar /> */}
        <Avatar
          src={user.photoURL}
          sx={{
            cursor: "pointer",
            ":hover": {
              opacity: 0.8,
            },
          }}
          onClick={async () => {
            await signOut(auth);
          }}
        />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>
      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
      {/* List of chats */}
      {chatShapShot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 10px;
  }
  @media (max-width: 480px) {
    padding: 5px;
  }
  @media (max-width: 320px) {
    padding: 5px;
  }
  @media (max-width: 240px) {
    padding: 5px;
  }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  font-size: 16px;
  padding: 10px;
  background-color: whitesmoke;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke !important;
  border-bottom: 1px solid whitesmoke !important;
`;
