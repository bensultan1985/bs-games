import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Anchor, Container, Text, Title, Image } from "@mantine/core";
import { UserDashboard } from "../components/UserDashboard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { theme } from "../styles/mantineGlobalTheme";
import { ConnectFourGame } from "../components/ConnectFour";

const Beardle: NextPage = (props) => {
  return (
    <iframe
      style={{
        position: "fixed",
        paddingTop: "50px",
        paddingBottom: "30px",
        border: "none",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      src="https://beardle.herokuapp.com"
    ></iframe>
  );
};

export default Beardle;
