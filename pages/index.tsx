import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  Anchor,
  Container,
  Text,
  Title,
  Image,
  Button,
  CardSection,
} from "@mantine/core";
import { UserDashboard } from "../components/UserDashboard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { theme } from "../styles/mantineGlobalTheme";
import { ConnectFourGame } from "../components/ConnectFour";
import { useRouter } from "next/router";
import { GameSummaryCard } from "../components/game-summary-card";

const Home: NextPage = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  // console.log(theme);
  console.log(session);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {session?.user?.name && (
          <Container>
            <UserDashboard user={session.user.name}></UserDashboard>
          </Container>
        )}
        <Container>
          <Title>
            So, you&#39;re bored to death? We&#39;ve got the remedy!
          </Title>
          <div
            style={{
              display: "flex",
              marginTop: "30px",
              marginBottom: "32px",
            }}
          >
            <div style={{ flex: 1 }}>
              <Image
                // className="mt-5"
                // my="xl"
                src="/images/logos/bsgames3.PNG"
                width={200}
              ></Image>
            </div>
            <div
              style={{
                flex: 3,
                border: "solid",
                borderWidth: "4px",
                borderRadius: "25px",
                padding: "20px",
                fontWeight: 600,
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                Hey <b>Gamer</b>,<br></br>
              </div>
              <b style={{ color: "red" }}>Benji</b> here! I&#39;m a one-dude
              game development operation. No corporate fat-cats here. Just
              blood, sweat, and code! My games are the OTC cure for your
              boredom. So whether you&#39;re waiting in a concert line or
              fighting off zzz&#39;s on the subway, click a game and feel the
              time fly by!
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div
              style={{
                // position: "absolute",
                zIndex: 100,
                margin: "20px",
                height: "80%",
                display: "flex",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div
                style={{
                  flex: 1,
                  border: "solid",
                  borderWidth: "4px",
                  borderRadius: "25px",
                  padding: "20px",
                  background: "white",
                  fontWeight: 600,
                  maxWidth: "50%",
                  height: "100%",
                  width: "100%",
                  // borderColor: "#b00038",
                  alignContent: "right",
                }}
              >
                <span>
                  <div style={{ marginBottom: "10px" }}>
                    ...and <b style={{ color: "#2a74b6" }}>I&#39;m Artie...</b>
                  </div>
                  <b style={{ color: "#2a74b6" }}>...Artie Intelligence</b>. My
                  prime directive is to <b style={{ color: "red" }}>KILL</b>...
                  your boredom. I can play against you in games marked{" "}
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#c3ffe1",
                      border: "solid",
                      borderRadius: "25px",
                      padding: "1px 8px",
                      borderWidth: "2px",
                      borderColor: "#c3ffe1",
                      background: "#2a74b6",
                    }}
                  >
                    Powered by Artie
                  </span>
                </span>
              </div>
              <div
                style={{
                  border: "solid",
                  borderColor: "white",
                  borderRadius: "25px",
                  flex: 1,
                  padding: "0px 10px",
                }}
              >
                <Image
                  style={{
                    flex: 1,
                    padding: "0px 10px",
                  }}
                  // className="mt-5"
                  // my="xl"
                  src="/images/logos/artie.PNG"
                  height={150}
                  // width={800}
                ></Image>
              </div>
            </div>
          </div>
          {/* <Button
              onClick={() => {
                router.push("/connect-four");
              }}
            >
              Connect Four
            </Button> */}
          <Title style={{ marginTop: "24px", minWidth: "280px" }}>
            Featured Games
          </Title>
          <Image
            style={{ padding: "0px", textAlign: "left" }}
            src="/images/logos/squares.png"
            height={4}
            width="100%"
          ></Image>
          <div
            className="three-flex"
            style={{
              display: "flex",
              gridTemplateColumns: "1fr 1fr 1fr",
              marginTop: "20px",
              gridGap: "5px",
              gridTemplateRows: "1fr 1fr 1fr",
            }}
          >
            <GameSummaryCard
              title="Connect Four"
              summary={
                <div>Can you outsmart Artie in a round of connect four?</div>
              }
              image="/images/logos/connectfour2.PNG"
              ai={true}
              link="/connect-four"
            ></GameSummaryCard>
            <GameSummaryCard
              title="Beardle"
              image="/images/logos/beardle.PNG"
              link="/beardle"
              summary={
                <div>
                  Like Wordle, but for beards! Guess the mystery man behind the
                  beard! Over 365 beard puzzles in all!
                </div>
              }
            ></GameSummaryCard>
            <GameSummaryCard
              title="NewsLibz"
              summary="MadLibs on steroids! This game automatically grabs the latest NY Times article summaries and turns them into libs!"
              link="/newslibz"
              image="/images/logos/newslibz.PNG"
            ></GameSummaryCard>
            <GameSummaryCard
              title="Tankarus"
              summary="A simple yet addicting 2D tank shooter, similar to the early 2000s game, Snowball Fight."
              image="/images/logos/tankarus.PNG"
              availability="unreleased"
            ></GameSummaryCard>
          </div>
          {/* <Image
              my="xl"
              src="http://localhost:3000/images/logos/heroimage.jpeg"
              height={200}
            ></Image>
            <Text my="xl">
              CheckLyst is a free, lightweight, and addictive to-do list
              application. To unlock the power of CheckLyst,{" "}
              <Link href="/Register">
                <Anchor variant="gradient">Sign up</Anchor>
              </Link>{" "}
              today!
            </Text> */}
        </Container>
      </main>
    </div>
  );
};

export default Home;
