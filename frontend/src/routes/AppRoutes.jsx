import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import MainLayout from "../components/MainLayout.jsx";
import Budget from "../pages/Budget.jsx";
import Categories from "../pages/Categories.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Expenses from "../pages/Expenses.jsx";
import Income from "../pages/Income.jsx";
import Login from "../pages/Login.jsx";
import Profile from "../pages/Profile.jsx";
import Reports from "../pages/Reports.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}
