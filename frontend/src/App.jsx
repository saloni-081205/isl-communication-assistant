import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

     {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}/>
      </Route>

      
      
    </Routes>
  );
}

export default App;