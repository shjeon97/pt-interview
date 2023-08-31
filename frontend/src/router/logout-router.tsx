import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotFound } from "../page/404";
import { AdminLogin } from "../page/admin-login";
import { TesterLogin } from "../page/tester-login";

export const LogoutRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/tester-login" element={<TesterLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
