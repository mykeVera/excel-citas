import React from "react";
import { Routes, Route } from "react-router-dom";

import NotFoundPage from "./pages/layouts/NotFoundPage";

import LoginPage from "./pages/auth/LoginPage";
import PasswordPage from "./pages/auth/PasswordPage";
import MainContainer from "./pages/structure/MainContainer";
import UsersPage from "./pages/users/UsersPage";
import DasboardPage from "./pages/dashboard/DashboardPage";

import CreateUserPage from "./pages/users/CreateUserPage";
import EditUserPage from "./pages/users/EditUserPage";

import ImportAppointment from "./pages/excel/ImportAppointment";
import SearchAppointment from "./pages/excel/SearchAppointment";
import ReportAppointment from "./pages/reports/ReportAppointments";

import TestPrintPage from "./pages/excel/TestPrint";

const App = () => {
  return (
    <Routes>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/" element={<LoginPage />} />

      <Route path="/main" element={<MainContainer />}>
        <Route index element={<DasboardPage />} />

        <Route path="users" element={<UsersPage />} />
        <Route path="users/create" element={<CreateUserPage />} />
        <Route path="users/edit/:id_user" element={<EditUserPage />} />
        <Route path="users/update/pass/:id_user" element={<PasswordPage />} />
        
        <Route path="appointment/import" element={<ImportAppointment />} />
        <Route path="appointment/search" element={<SearchAppointment />} />
        <Route path="appointment/report" element={<ReportAppointment />} />

        <Route path="print" element={<TestPrintPage />} />
      </Route>
      
    
    </Routes>
  );
}

export default App;
