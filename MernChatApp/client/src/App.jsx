import RegisterAndLoginForm from "./components/RegisterAndLoginForm";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Routes from "./components/Routes";

function App() {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true; //to set cookies in browser

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
