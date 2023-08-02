// Import necessary modules and components
import Head from "next/head";
import React from "react";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { chatCollectionRef } from "../../firebaseConfig";
import {
  collection,
  doc,
  query,
  orderBy,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import getRecipientEmail from "../../utils/getRecipientEmail";

// Chat function component
function chat({ messages, chat }) {
  // Fetch the authenticated user's state using useAuthState hook
  const [user] = useAuthState(auth);

  // Render the chat interface
  return (
    <Container>
      {/* Set the title of the page dynamically based on the chat users and the current user */}
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      {/* Render the Sidebar component */}
      <Sidebar />
      {/* Render the ChatContainer with ChatScreen component */}
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

// Export the chat component as the default export
export default chat;

// Styled components for styling
const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// Server-side rendering function to fetch chat messages and chat data from Firestore
export async function getServerSideProps(context) {
  // Get the reference to the chat document in Firestore
  const ref = doc(chatCollectionRef, context.query.id);

  // Fetch messages collection and order them by timestamp in ascending order
  const messagecollection = collection(ref, "messages");
  const q = query(messagecollection, orderBy("timestamp", "asc"));
  const messageResponse = await getDocs(q);

  // Process and format the fetched messages
  const messages = messageResponse.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  // Fetch the chat document and its data from Firestore
  const chatResponse = await getDoc(ref, context.query.id);
  const chat = {
    id: chatResponse.id,
    ...chatResponse.data(),
  };

  // Return the messages and chat data as props to the chat component
  return {
    props: {
      messages: messages,
      chat: JSON.parse(JSON.stringify(chat)),
    },
  };
}
