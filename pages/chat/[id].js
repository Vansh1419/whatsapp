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
function chat({ messages, chat }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default chat;

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

export async function getServerSideProps(context) {
  const ref = doc(chatCollectionRef, context.query.id);
  const messagecollection = collection(ref, "messages");
  const q = query(messagecollection, orderBy("timestamp", "asc"));
  const messageResponse = await getDocs(q);
  const messages = messageResponse.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));
  const chatResponse = await getDoc(ref, context.query.id);
  const chat = {
    id: chatResponse.id,
    ...chatResponse.data(),
  };
  return {
    props: {
      messages: messages,
      chat: JSON.parse(JSON.stringify(chat)),
    },
  };
}
