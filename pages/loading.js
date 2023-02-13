import { CircularProgress } from "@mui/material";
import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <center
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        backgroundColor: "whitesmoke",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          height={200}
          width={200}
          alt="WhatsApp"
        />
        <CircularProgress color="success" />
      </div>
    </center>
  );
};

export default Loading;
