import React,{useState,useEffect} from "react";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import "./AdmDashboard.css";

const AdmDashboard = (props) => {

  const [users,setUsers]=useState(0);
  const [user,setUser]=useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const toastId = toast.loading("Fetching details, please wait...", {
        position: "top-center",
      });

      try {
        const response = await axios.get(`${props.api}/allusers`,{ withCredentials: true });
        const totalUsers = response.data.users?.length || 0;
        setUsers(totalUsers);
        setUser(response.data.user.name);
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
        <h1 className="main-head">{`WELCOME ${user}`}</h1>
        <div className="item-container">
          <div className="dash-card">
            <h2 className="card-head">Number of Current Users: {users}</h2>
          </div>
          <div className="dash-card">
            <h2 className="card-head">Manage Users</h2>
            <NavLink to="/alluser">
              <Button variant="outlined" id="item-btn">
                Click here
              </Button>
            </NavLink>
          </div>
        </div>
        <a href="/" className="btn btn-primary">
          Logout
        </a>
      </div>
    </div>
  );
};

export default AdmDashboard;
