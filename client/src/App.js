import Home from "./page/home/Home";
import Login from "./page/login/Login";
import Profile from "./page/profile/Profile";
import Register from "./page/register/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const {user} = useContext(AuthContext);
  return (
  <Router>
    <Routes>
      <Route path="/" element={user ? <Home/> : <Login/>}></Route>
      <Route path="/login" element={user ? <Navigate to="/"/> : <Login/>}></Route>
      <Route path="/register" element={user ? <Navigate to="/"/> : 
      <Register/>}></Route>
      <Route path="/profile/:username" element={<Profile/>}></Route>
    </Routes>
  </Router>
    )
}

export default App;
