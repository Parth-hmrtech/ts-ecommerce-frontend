import AppRoutes from "./routes";
import { RouterProvider } from "react-router-dom";

import './App.css';

const App = () => {
  return <RouterProvider router={AppRoutes} />;
};

export default App;