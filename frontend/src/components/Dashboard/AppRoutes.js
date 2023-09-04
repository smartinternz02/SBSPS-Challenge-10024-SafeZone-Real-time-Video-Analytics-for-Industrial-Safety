import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Statistics from "./Statistics";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/statistics" element={<Statistics />} />
    </Routes>
  );
}
