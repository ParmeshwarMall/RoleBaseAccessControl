import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Register.css"

const Register = (props) => {
  let [user, setUser] = useState({
    name: "",
    email: "",
    username:"",
    password:"",
    role:"user"
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputs = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    let toastId;
    try {
      toastId = toast.loading("Waiting for confirmation, please wait...", {
        position: "top-center",
      });

      const response = await axios.post(`${props.api}/register`, user);
  
      if (response.status === 201) {
        toast.update(toastId, {
          render: "Registered Successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        navigate('/');
  
        setUser({
          name: "",
          email: "",
          username: "",
          password: "",
        });
      }
    } catch (error) {
  
      if (error.response) {
        const { status, data } = error.response;
  
        if (status === 409) {
          toast.update(toastId, {
            render: data.message || "Username already exists. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        } else {

          toast.update(toastId, {
            render: data.message || "Error during registration. Please try again.",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } else {

        toast.update(toastId, {
          render: "Network error. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
      console.error("Error adding user:", error);
    }
  };
  

  return (
    <div className="form-container">
      <div className="form">
        <div className="main-head">Register Yourself</div>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label for="exampleFormControlInput1" class="form-label">
              Name:
            </label>
            <input
              type="name"
              name="name"
              placeholder="Enter name"
              class="form-control form1"
              id="exampleFormControlInput1"
              autoComplete="off"
              value={user.name}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput2" class="form-label">
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              class="form-control form1"
              id="exampleFormControlInput2"
              autoComplete="off"
              value={user.email}
              onChange={handleInputs}
              required
            />
          </div>

          <div className="mb-3">
            <label for="exampleFormControlInput4" class="form-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              class="form-control form1"
              id="exampleFormControlInput4"
              autoComplete="off"
              value={user.username}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="mb-3">
            <label for="exampleFormControlInput3" class="form-label">
              Password
            </label>
            <div className="pass">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                class="form-control form1"
                id="exampleFormControlInput9"
                autoComplete="off"
                value={user.password}
                onChange={handleInputs}
                required
              />
              <button
                type="button"
                onClick={handlePasswordVisibilityToggle}
                className="eye-icon3 cursor-pointer"
              >
                {passwordVisible ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

