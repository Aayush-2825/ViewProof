import { Routes, Route } from "react-router";

import './index.css'
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Landing/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/reset-password" element={<PasswordReset/>}/>
        <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      </Routes>
    </>
  );
}

export default App