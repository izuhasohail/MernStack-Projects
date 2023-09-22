import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLoginOrRegister === "register" ? "/register" : "/login";

    try {
      await axios
        .post(url, {
          username,
          password,
        })
        .then((res) => {
          console.log(res.data);
          setLoggedInUsername(username);
          setId(res.data._id);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-blue-100 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-600 text-white block  w-full h-10 rounded-sm">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className=" text-center mt-2 ">
          {isLoginOrRegister === "register" && (
            <div>
              Already a member?
              <button
                className=" ml-1 "
                onClick={() => setIsLoginOrRegister("login")}
              >
                Login here
              </button>
            </div>
          )}

          {isLoginOrRegister === "login" && (
            <div>
              Don't have an account?
              <button
                className=" ml-1 "
                onClick={() => setIsLoginOrRegister("register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterAndLoginForm;
