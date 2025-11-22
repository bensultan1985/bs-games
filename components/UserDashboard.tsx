import { Box, Container, Text } from "@mantine/core";
import { CreateToDo } from "./CreateToDo";
import { ToDoList } from "./ToDoList";

export function UserDashboard(props: any) {
  //get next-auth token from cookie
  const token = props.session;
  console.log(token);
  const { user } = props;
  return (
    <></>
    // <Container size="lg">
    //   <Box m="md" p="sm">
    //     <Text>{user} signed in.</Text>
    //     {/* <CreateToDo></CreateToDo> */}
    //   </Box>
    //   {/* <ToDoList
    //   //placeholder data
    //   ></ToDoList> */}
    // </Container>
  );
}
