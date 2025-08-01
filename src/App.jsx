import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/maincomponent/Navbar";
import DashboardContent from "./components/maincomponent/DashboardContent";
import User from "./components/maincomponent/User";
import Orders from "./components/maincomponent/Orders";
import Products from "./components/maincomponent/Products";
import AlProducts from "./components/maincomponent/AlProducts";
import AlProductDetail from "./components/maincomponent/AlProductDetail";
import Charts from "./components/maincomponent/charts/Charts";
import LoginAdmin from "./components/login/LoginAdmin";
import { AdminContext } from "./components/context/AdminContext"; // Import context
import { ToastContainer } from "react-toastify";
import QuoteAdmin from "./components/maincomponent/QuoteAdmin";
import Blog from "./components/maincomponent/Blog";
import Reports from "./components/maincomponent/Reports";
import AlSuppliers from "./components/maincomponent/AlSuppliers";
import SupplierCategories from "./components/maincomponent/SupplierCategories";
import UserOrders from "./components/maincomponent/UserOrders";
import GlobalDiscount from "./components/maincomponent/GlobalDiscount";
import AddCoupen from "./components/maincomponent/AddCoupen";

const PrivateRoute = ({ element }) => {
  const { aToken } = useContext(AdminContext);
  return aToken ? element : <Navigate to="/login" replace />;
};

const App = () => {
  const { aToken } = useContext(AdminContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      {aToken ? (
        <div>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className={`${isSidebarOpen ? "ml-64" : "ml-20"} flex-1 transition-all duration-300`}>
            <Navbar />
            <DashboardContent>
              <Routes>
                <Route path="/" element={<PrivateRoute element={<Charts isOpen={isSidebarOpen} />} />} />
                <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
                <Route path="/order-details/:id" element={<PrivateRoute element={<Products />} />} />
                <Route path="/user-orders/:id" element={<PrivateRoute element={<UserOrders />} />} />
                <Route path="/products" element={<PrivateRoute element={<AlProducts />} />} />
                <Route path="/suppliers" element={<PrivateRoute element={<AlSuppliers />} />} />
                <Route path="/supplier-categories" element={<PrivateRoute element={<SupplierCategories />} />} />
                <Route path="/global-discount" element={<PrivateRoute element={<GlobalDiscount />} />} />
                <Route path="/add-coupen" element={<PrivateRoute element={<AddCoupen />} />} />
                <Route path="/quote" element={<PrivateRoute element={<QuoteAdmin />} />} />
                <Route path="/reports" element={<PrivateRoute element={<Reports />} />} />
                <Route path="/product/:id" element={<PrivateRoute element={<AlProductDetail />} />} />
                <Route path="/users" element={<PrivateRoute element={<User />} />} />
                <Route path="/blogs" element={<PrivateRoute element={<Blog />} />} />
                <Route path="/analytics" element={<PrivateRoute element={<h1>Analytics</h1>} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DashboardContent>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginAdmin />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
};

export default App;