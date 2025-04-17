import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { Overview } from './Overview';
import { UserManagement } from './UserManagement';
import { IndividualDiamondManagement } from './IndividualDiamondManagement';
import { WholesaleDiamondManagement } from './WholesaleDiamondManagement';
import { AddIndividualDiamond } from './forms/AddIndividualDiamond';
import { AddWholesaleDiamond } from './forms/AddWholesaleDiamond';
import { EditIndividualDiamond } from './forms/EditIndividualDiamond';
import { EditWholesaleDiamond } from './forms/EditWholesaleDiamond';

export function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="individual-diamonds" element={<IndividualDiamondManagement />} />
        <Route path="individual-diamonds/add" element={<AddIndividualDiamond />} />
        <Route path="individual-diamonds/edit/:id" element={<EditIndividualDiamond />} />
        <Route path="wholesale-diamonds" element={<WholesaleDiamondManagement />} />
        <Route path="wholesale-diamonds/add" element={<AddWholesaleDiamond />} />
        <Route path="wholesale-diamonds/edit/:id" element={<EditWholesaleDiamond />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}