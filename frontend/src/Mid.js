import MonitorPage from './pages/monitorPage';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

function Mid() {

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/admin/dashboard.html" element={<MonitorPage />} />
            </Routes>
        </BrowserRouter>
    )

}

export default Mid;