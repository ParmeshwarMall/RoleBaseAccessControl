import React from 'react'
import { Navigate,Outlet } from "react-router-dom"
import { isAdLog } from "./Login/Login";

const ProtectedRoute = () => {
    const isAuth=isAdLog;
    return isAuth?<Outlet/> :<Navigate to='/'/>
}

export default ProtectedRoute;
