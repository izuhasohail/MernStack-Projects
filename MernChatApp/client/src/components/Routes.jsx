import React from "react";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import RegisterAndLoginForm from "./RegisterAndLoginForm";
import Chat from "./Chat";
const Routes = () => {
  const { username, id } = useContext(UserContext);

  if (username) {
    return <Chat/>
  }
  return <RegisterAndLoginForm />;
};

export default Routes;
