import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { Overview } from './Overview';
import { UserManagement } from './UserManagement';
import { DiamondManagement } from './DiamondManagement';

export function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="diamonds" element={<DiamondManagement />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}