import React from "react";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import moment from "moment";
const Message = ({ user, message }) => {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;
  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        {/* {new Date(message.timestamp).toUTCString()} */}
        <TimeStamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </TimeStamp>
      </TypeOfMessage>
    </Container>
  );
};

export default Message;

const Container = styled.div``;
const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 6px;
  min-width: 100px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;
const Reciever = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;
const TimeStamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
  font-weight: 900;
`;
