import React from "react";
import { RouterProvider } from "react-router-dom";
import AppRoutes from "./routes";
import './App.css';

const App: React.FC = () => {
  return <RouterProvider router={AppRoutes} />;
};

export default App;