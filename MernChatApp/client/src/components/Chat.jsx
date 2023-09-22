import React, { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "../UserContext";
import _, { sortedIndexOf } from "lodash";
import axios from "axios";
import Contact from "./Contact";
const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePpl, setOnlinePpl] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const divUnderMessages = useRef();
  const [offlinePpl, setOfflinePpl] = useState({});

  useEffect(() => {
    connectToWs();
  }, []);

  function logout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessages);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to reconnect..");
        connectToWs();
      }, 1000); //1000ms =1s
    });
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      // console.log('Users are : ',res.data);
      const offlinePplArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePpl).includes(p._id));
      const offlinePpl = {};
      offlinePplArr.forEach((p) => {
        offlinePpl[p._id] = p;
      });
      setTimeout(() => {
        console.log({ offlinePplArr, offlinePpl });
        setOfflinePpl(offlinePpl);
      }, 1000);
    });
  }, [onlinePpl]);

  //grabbing all the online people
  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });

    console.log(people);
    setOnlinePpl(people);
  }

  function sendFile(e) {
    //  const files=e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  }

  function handleMessages(e) {
    const messageData = JSON.parse(e.data);
    console.log({ e, messageData });
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      //console.log({ messageData });
      if(messageData.sender=== selectedUserId){
        setMessages((prev) => [...prev, { ...messageData }]);
      }
     
    }
  }

  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();

    console.log("sending");
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
      })
    );
    

    if (file) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
    else{
      setNewMessageText("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
    }
  }

  const onlinePplExcOurUser = { ...onlinePpl };
  delete onlinePplExcOurUser[id];

  const messagesWithoutDeuplicate = _.uniqBy(messages, "_id");

  return (
    <div className="flex h-screen">
      <div className=" bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          {Object.keys(onlinePplExcOurUser).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              username={onlinePplExcOurUser[userId]}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
              online={true}
            />
          ))}
          {Object.keys(offlinePpl).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              username={offlinePpl[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
              online={false}
            />
          ))}
        </div>

        <div className="p-4 text-center flex items-center justify-center gap-1">
          <span className="text-md mr-2 text-gray-600 font-semibold text-center flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 font-bold"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>

            {username}
          </span>
          <button
            onClick={logout}
            className=" text-xl text-gray-400 font-bold bg-blue-100 px-2 py-1 border rounded-sm"
          >
            logout
          </button>
        </div>
      </div>
      <div className=" flex flex-col bg-blue-50 w-2/3 p-2">
        <div className=" flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center font-bold text-gray-300 text-2xl">
              ⬅️ Select a person from the sidebar
            </div>
          )}
          {selectedUserId && (
            <div className=" relative h-full">
              <div className="overflow-y-scroll absolute top-0 right-0 left-0 bottom-2">
                {messagesWithoutDeuplicate.map((message) => (
                  <div
                    key={message._id}
                    className={
                      message.sender === id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        " text-left inline-block p-2 my-2 rounded-md text-sm" +
                        (message.sender === id
                          ? " bg-blue-500 text-white"
                          : " bg-white text-gray-500")
                      }
                    >
                      {message.text}
                      {message.file && (
                        <div className="">
                          
                          <a target="_blank"
                            className=" flex items-center gap-1 border-b"
                            href={axios.defaults.baseURL + "/uploads/" + message.file}
                          >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                              clipRule="evenodd"
                            />
                          </svg>
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>

        {selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              type="text"
              className="bg-white  rounded-sm p-2 flex-grow border focus:outline-none focus:ring-0 focus:border-2 focus:border-blue-500"
              placeholder="Type your message here"
            />
            <label
              type="button"
              className=" bg-blue-200 p-2 text-gray-600 rounded-sm border border-blue-200 cursor-pointer"
            >
              <input type="file" className="hidden" onChange={sendFile} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default Chat;
