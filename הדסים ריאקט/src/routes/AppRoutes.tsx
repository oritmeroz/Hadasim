import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../Pages/LoginPage';  // דף התחברות
import RegisterSupplierPage from '../Pages/RegisterSupplierPage';  // דף הרשמה לספק
import RegisterUserPage from '../Pages/RegisterUserPage';  // דף הרשמה למשתמש
import UserOrdersPage from '../Pages/UserOrdersPage';
import SupplierOrdersPage from '../Pages/SupplierOrdersPage';
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* דף התחברות */}
      
      <Route path="/Userorderpage" element={<UserOrdersPage />} /> 
      <Route path="/SupplierOrdersPage" element={<SupplierOrdersPage />} /> 

      {/* דף הרשמה לספק */}
      <Route path="/supplier-register" element={<RegisterSupplierPage />} /> 

      {/* דף הרשמה למשתמש */}
      <Route path="/user-register" element={<RegisterUserPage />} />

      {/* אם המשתמש נכנס ל-"/", נווט אותו לדף התחברות */}
      <Route path="/" element={<LoginPage />} /> 
    </Routes>
  );
};

export default AppRoutes;
