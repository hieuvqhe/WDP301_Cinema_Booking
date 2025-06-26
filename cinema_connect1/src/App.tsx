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
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Auth routes - no layout */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />

        {/* Public landing page */}
        <Route path="/" element={
          <>
            <Navbar />
            <HomePage />
            <Footer />
          </>
        } />

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
              {/* Public routes - accessible to all users */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              
              {/* Routes that require authentication */}
              <Route path="/movies/:id/:screenId" element={
                <ProtectedRoute>
                  <SeatLayout />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <MyBooking />
                </ProtectedRoute>
              } />
              <Route path="/favourite" element={
                <ProtectedRoute>
                  <Favourite />
                </ProtectedRoute>
              } />

              {/* Default routes */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </>
  );
}

export default App;
