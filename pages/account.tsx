//create a basic account component for a user. This page should show the user's profile image and the user's name
import Head from "next/head";
import { Title, Image } from "@mantine/core";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Account() {
  const session = useSession();
  console.log(session?.data?.user?.image);
  return (
    <div>
      <Head>
        <title>Account</title>
        <meta name="description" content="User account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Title>Account</Title>
        <p>
          {session?.data?.user?.name}{" "}
          {session?.data?.user?.image && (
            <Image src={session?.data?.user?.image || ""} alt="profile image" />
          )}
        </p>
      </main>
    </div>
  );
}
