import React from "react";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/layouts/NotFoundPage";
import SearchAppointment from "./pages/excel/SearchAppointment";

const App = () => {
  return (
    <Routes>

      <Route path="*" element={<NotFoundPage />} />
      <Route index element={<SearchAppointment />} />
    
    </Routes>
  );
}

export default App;
