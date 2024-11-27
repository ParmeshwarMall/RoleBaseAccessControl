import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./Login.css";

let isAdLog = false;
let isUserLog = false;

export default function Login(props) {
  const [user, setUser] = useState({ username: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const submit = async (e) => {
    e.preventDefault();

    let toastId;

    try {
      toastId = toast.loading("Logging in, please wait...", {
        position: "top-center",
      });

      const response = await axios.post(`${props.api}/login`, user, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const { message, role } = response.data;

        toast.update(toastId, {
          render: message || "Logged in successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        if (role === "admin") {
          isAdLog = true;
          navigate("/admdashboard");
        } else {
          isUserLog = true;
          navigate("/userdashboard");
        }
      }
    } catch (e) {
      if (e.response) {
        const { status, data } = e.response;

        if (status === 404) {
          toast.update(toastId, {
            render: "User not found",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        } else if (status === 401) {
          toast.update(toastId, {
            render: "Invalid password",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          toast.update(toastId, {
            render: data || "An unexpected error occurred. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } else {
        toast.update(toastId, {
          render: "Network error. Please check your connection.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
      console.error("Login error:", e);
    }
  };

  return (
    <div className="login">
      <h1 className="head">Role Base Access Control</h1>

      <form onSubmit={submit} className="login__form">
        <h1 className="login__title">Login</h1>

        <div className="login__content">
          <div className="login__box">
            <i className="ri-user-3-line login__icon"></i>
            <div className="login__box-input">
              <input
                type="text"
                required
                className="login__input"
                id="login-email"
                name="username"
                value={user.username}
                onChange={handleInput}
                placeholder=" "
              />
              <label htmlFor="login-email" className="login__label">
                Username
              </label>
            </div>
          </div>

          <div className="login__box">
            <i className="ri-lock-2-line login__icon"></i>
            <div className="login__box-input">
              <input
                type={passwordVisible ? "text" : "password"}
                required
                className="login__input"
                id="login-pass"
                name="password"
                value={user.password}
                onChange={handleInput}
                placeholder=" "
              />
              <label htmlFor="login-pass" className="login__label">
                Password
              </label>

              <span
                className="login__eye"
                onClick={handlePasswordVisibilityToggle}
                style={{ cursor: "pointer" }}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
        </div>
        <div className="login__check">
          <NavLink to="/forgotpassword" className="login__forgot">
            Forgot Password?
          </NavLink>
        </div>

        <button type="submit" className="login__button">
          Login
        </button>
        <p class="login__register">
          Don't have an account? <NavLink to="/register">Register</NavLink>
        </p>
      </form>
    </div>
  );
}

export { isAdLog, isUserLog };
