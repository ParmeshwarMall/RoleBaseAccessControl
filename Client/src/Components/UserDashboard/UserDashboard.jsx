import React,{useState,useEffect} from "react";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const UserDashboard = (props) => {

  const [user,setUser]=useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const toastId = toast.loading("Fetching details, please wait...", {
        position: "top-center",
      });

      try {
        const response = await axios.get(`${props.api}/allusers`,{ withCredentials: true });
        setUser(response.data.user);
        toast.update(toastId, {
          render: "Data fetched successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.update(toastId, {
          render: "Failed to fetch user details.",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    };

    fetchUsers();
  }, [props.api]);

  return (
    <div className="maindash-container">
      <div className="dash-container">
        <h1 className="main-head">{`WELCOME ${user.name}`}</h1>
        <div className="item-container">
          <h3 className="sub-head">Your Details!</h3>
          <ul>
            <li style={{marginBottom:"10px"}}>
                <strong>Name:</strong> {user.name}
            </li>
            <li style={{marginBottom:"10px"}}>
                <strong>Email:</strong> {user.email}
            </li>
            <li style={{marginBottom:"10px"}}>
                <strong>Username:</strong> {user.username}
            </li>
            <li style={{marginBottom:"10px"}}>
                <strong>Role:</strong> {user.role}
            </li>
          </ul>
        </div>
        <a href="/" className="btn btn-primary">
          Logout
        </a>
      </div>
    </div>
  );
};

export default UserDashboard;
