import { Routes, Route } from "react-router";

import './index.css'
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

import PrivateRoute from "./components/PrivateRoute";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import PasswordReset from "./pages/auth/PasswordReset";
import Album from "./pages/Album";


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
        <Route path='/album/:id' element={<Album />}/>
      </Route>
      </Routes>
    </>
  );
}

export default App