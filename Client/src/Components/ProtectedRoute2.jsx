import React from 'react'
import { Navigate,Outlet } from "react-router-dom"
import { isUserLog } from "./Login/Login";

const ProtectedRoute = () => {
    const isAuth=isUserLog;
    return isAuth?<Outlet/> :<Navigate to='/'/>
}

export default ProtectedRoute;
