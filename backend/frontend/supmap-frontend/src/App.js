import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MapView from "./pages/MapView";
import Statistiques from "./pages/Statistiques"


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/register" element={<Register />} />
        <Route path="/statistiques" element={<Statistiques />} />
      </Routes>
    </div>
  );
}

export default App;
