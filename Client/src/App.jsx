import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Components/Login/Login";
import AdmDashboard from "./Components/AdmDashboard/AdmDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import AllUsers from "./Components/AllUsers/AllUsers";
import Register from "./Components/Register/Register";
import UserDashboard from "./Components/UserDashboard/UserDashboard";
import ProtectedRoute2 from "./Components/ProtectedRoute2";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = "http://localhost:8000";
// const api="https://rbac-backend-2.onrender.com"

function App() {
  return (
    <Router>
      <div>
        <ToastContainer theme="colored" />
        <Routes>
          <Route path="/" element={<Login api={api} />} />
          <Route path="/register" element={<Register api={api} />} />
          <Route path="/forgotpassword" element={<ForgotPassword api={api}/>}/>
          <Route element={<ProtectedRoute />}>
            <Route path="/admdashboard" element={<AdmDashboard api={api} />} />
            <Route path="/alluser" element={<AllUsers api={api} />} />
          </Route>
          <Route element={<ProtectedRoute2 />}>
            <Route
              path="/userdashboard"
              element={<UserDashboard api={api} />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
