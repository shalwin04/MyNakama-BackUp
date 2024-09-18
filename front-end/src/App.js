// import logo from "./logo.svg";
import "./App.css";
// import Home from "./pages/Home";
// import Welcome from "./pages/Welcome";
// import Share from "./pages/Share";
// import Login from "./pages/Login";
// import ChatInterface from "./pages/ChatInterface";
// import LoginPage from "./pages/LoginPage";
import React from "react";
import AllRoutes from "./pages/AllRoutes";
import { BrowserRouter as Router } from "react-router-dom";
// import { UserProvider } from "./UserContext";

function App() {
  return (
    <Router>
      <AllRoutes />
    </Router>
  );
}

export default App;
