import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

import MainLayout from "../components/layout/MainLayout.jsx";
import AdminLayout from "../components/layout/AdminLayout.jsx";

import Dashboard from "../pages/User/Dashboard.jsx";
import Income from "../pages/User/Income.jsx";
import Expenses from "../pages/User/Expenses.jsx";
import Categories from "../pages/User/Categories.jsx";
import Budget from "../pages/User/Budget.jsx";
import Reports from "../pages/User/Reports.jsx";
import Profile from "../pages/User/Profile.jsx";

import Login from "../pages/Auth/Login.jsx";
import Landing from "../pages/Landing.jsx";


import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
import Users from "../pages/Admin/Users.jsx";
import MasterCategories from "../pages/Admin/MasterCategories.jsx";
import UserDetail from "../pages/Admin/UserDetail.jsx";
import AdminReports from "../pages/Admin/AdminReports.jsx";
import Settings from "../pages/Admin/Settings.jsx";


export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>

        {/* USER ROUTES */}
        <Route element={<MainLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>

    <Route index element={<AdminDashboard />} />

    <Route
        path="users"
        element={<Users />}
    />
    <Route path="users/:id" element={<UserDetail />} />
    <Route path="categories" element={<MasterCategories />} />
    <Route path="reports" element={<AdminReports />} />
    <Route path="settings" element={<Settings />} />
    <Route path="profile" element={<Profile />} />

</Route>

      </Route>

    </Routes>
  );
}
