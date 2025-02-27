import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Pages/Authentication/Login';
import Registration from './Pages/Authentication/Registration';
import Dashboard from './Pages/Dashboard';
import Admin from './Pages/Admin/Admin';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import CommunityDetails from './Pages/Admin/CommunityDetails';
import Communities from './Pages/Admin/Communities';
import Users from './Pages/Users/Users'
import UserList from './Pages/Admin/UserList'
import UserDetails from './Pages/Admin/UserDetails'
export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="*" element={<Dashboard />}>
          <Route path="admin" element={<Admin />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-community" element={<Communities />} />
          <Route path="users-list" element={<UserList />} />
          <Route path="users-details" element={<UserDetails />} />
          <Route path="community-details" element={<CommunityDetails/>} />
          <Route path="user-dashboard" element={<Users/>} />
        </Route>
      </Routes>
    </Router>
  );
}

