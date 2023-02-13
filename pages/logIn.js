import { async } from "@firebase/util";
import { Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import Head from "next/head";
import React from "react";
import styled from "styled-components";
import { auth, provider } from "../firebaseConfig";

const LogIn = () => {
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Containter>
      <Head>
        <title>Log In</title>
      </Head>
      <LogInContainer>
        <Logo src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" />
        <Button onClick={signIn} variant="outlined">
          Log In with Google
        </Button>
      </LogInContainer>
    </Containter>
  );
};

export default LogIn;

const Containter = styled.div`
  display: grid;
  place-items: center;
  background-color: whitesmoke;
  height: 100vh;
`;
const LogInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
  background-color: white;
`;
const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
