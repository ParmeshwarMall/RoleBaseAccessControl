import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = (props) => {
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
      toastId = toast.loading("Waiting for confirmation, please wait...", {
        position: "top-center",
      });
  
      const response = await axios.post(
        `${props.api}/forgotpassword`,
        user 
      );
  
      if (response.status === 200) {
        toast.update(toastId, {
          render: "Password changed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
  
        navigate("/"); 
      }
    } catch (e) {
      const { response } = e;
  
      if (response && response.status === 404) {
        toast.update(toastId, {
          render: "User not found",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else if (response && response.status === 500) {
        toast.update(toastId, {
          render: "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: "Network error or server not reachable",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <div className="login">
      <form onSubmit={submit} className="login__form">
        <h1 className="login__title">Reset Password</h1>

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
                New Password
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

        <button type="submit" className="login__button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
