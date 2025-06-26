import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PartnerPage from "./pages/PartnerPage";
import AdminPage from "./pages/AdminPage";
import VerifyPage from "./pages/VerifyPage";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MoviesPage from "./pages/MoviesPage";
import MovieDetail from "./pages/MovieDetailPage/MovieDetailPage";
import SeatLayout from "./pages/SeatLayout/SeatLayout";
import MyBooking from "./pages/MyBooking/MyBooking";
import Favourite from "./pages/Favourite/Favourite";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Auth routes - no layout */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />

        {/* Admin routes - has own layout */}
        <Route path="/admin" element={
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </RoleProtectedRoute>
        } />

        {/* Partner/Staff routes - has own layout */}
        <Route path="/partner" element={
          <RoleProtectedRoute allowedRoles={["staff"]}>
            <PartnerPage />
          </RoleProtectedRoute>
        } />

        {/* Public/Customer routes with main layout */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              {/* Public routes - accessible to all authenticated users */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />

              {/* Customer routes */}
              <Route path="/movies" element={
                <RoleProtectedRoute allowedRoles={["customer", "admin"]}>
                  <MoviesPage />
                </RoleProtectedRoute>
              } />
              <Route path="/movies/:id" element={
                <RoleProtectedRoute allowedRoles={["customer", "admin"]}>
                  <MovieDetail />
                </RoleProtectedRoute>
              } />
              <Route path="/movies/:id/:date" element={
                <RoleProtectedRoute allowedRoles={["customer", "admin"]}>
                  <SeatLayout />
                </RoleProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <RoleProtectedRoute allowedRoles={["customer", "admin"]}>
                  <MyBooking />
                </RoleProtectedRoute>
              } />
              <Route path="/favourite" element={
                <RoleProtectedRoute allowedRoles={["customer", "admin"]}>
                  <Favourite />
                </RoleProtectedRoute>
              } />

              {/* Default routes */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </>
  );
}

export default App;
