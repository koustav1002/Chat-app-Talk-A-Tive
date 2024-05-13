import { Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact></Route>
      <Route path="/chats" component={ChatPage}></Route>
    </div>
  );
}

export default App;
