import { Anchor, Header, SimpleGrid, Title, Container } from "@mantine/core";
import Link from "next/link";
import LoginSection from "./LoginSection";
import { masterConfig } from "../config";
import { brandConfig } from "../config";
import { Menu, Button, Text } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import { LoginButton } from "../components/login/headerButton";
import { useSession, signOut } from "next-auth/react";

export function AppHeader() {
  const { data: session } = useSession();
  return (
    <Anchor>
      <Header
        height="auto"
        fixed
        px="xl"
        sx={(theme) => ({
          // backgroundColor: theme?.colors?.violet[5],
          backgroundColor: brandConfig.primaryComponentBackgroundColor,
          color: brandConfig.primaryComponentTextColor,
        })}
      >
        <SimpleGrid cols={2}>
          <div>
            <Link href={"/"}>
              <Title style={{ display: "inline-block" }}>
                {/* {masterConfig.global.appConfig.websiteData.suggested.title} */}
                <span style={{ color: "#fa5252" }}>Boredom</span>
                <span></span>
                <span style={{ color: "white" }}> Sucks</span>
                <span style={{ color: "#bababa" }}>!!!</span>
                {/* BS Gamez */}
              </Title>
            </Link>
          </div>
          {/* <div></div> */}
          {/* <LoginSection></LoginSection> */}

          <div style={{ textAlign: "right", marginTop: "4px" }}>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  // color="red"
                  color="red"
                  variant="outline"
                  // variant="outline"
                  style={{
                    maxWidth: "160px",
                    alignSelf: "right",
                    // color: "white",
                    // borderColor: "black",
                    // background: "red",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>Browse Games</span>{" "}
                  <IconMenu2 size={14}></IconMenu2>
                </Button>
              </Menu.Target>

              <Menu.Dropdown style={{ textAlign: "left" }}>
                <Menu.Label>Games</Menu.Label>
                <Menu.Item
                  onClick={() => {
                    window.location.href = "/connect-four";
                  }}
                >
                  Connect Four
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    window.location.href = "/beardle";
                  }}
                >
                  Beardle
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    window.location.href = "/newslibz";
                  }}
                >
                  NewsLibz
                </Menu.Item>
                {/* <Menu.Divider /> */}
              </Menu.Dropdown>
            </Menu>
            {session?.user?.name ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    // color="red"
                    color="red"
                    variant="outline"
                    // variant="outline"
                    style={{
                      maxWidth: "160px",
                      alignSelf: "right",
                      marginLeft: "5px",
                      // color: "white",
                      // borderColor: "black",
                      // background: "red",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>Account</span>{" "}
                    <IconMenu2 size={14}></IconMenu2>
                  </Button>
                </Menu.Target>

                <Menu.Dropdown style={{ textAlign: "left" }}>
                  {/* <Menu.Label>profile</Menu.Label> */}
                  <Menu.Item
                    onClick={() => {
                      window.location.href = "/connect-four";
                    }}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      window.location.href = "/beardle";
                    }}
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      window.location.href = "/newslibz";
                    }}
                  >
                    Favorites
                  </Menu.Item>
                  <Menu.Item onClick={() => signOut()}>Logout</Menu.Item>
                  {/* <Menu.Divider /> */}
                </Menu.Dropdown>
              </Menu>
            ) : (
              <LoginButton></LoginButton>
            )}
          </div>
        </SimpleGrid>
      </Header>
    </Anchor>
  );
}
