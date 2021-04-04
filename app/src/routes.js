import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import PaperListView from 'src/views/papers/PaperListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import AnalyticsView from 'src/views/analytics/AnalyticsView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import ArchitectureView from 'src/views/architecture/ArchitectureView';
import InstanceComponentView from 'src/views/components/InstanceComponentView';
import BaseComponentsView from 'src/views/components/BaseComponentsView';

const routes = (isLoggedIn) => [
  {
    path: 'app',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" replace />,
    children: [
      { path: 'analytics', element: <AnalyticsView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'papers', element: <PaperListView /> },
      { path: 'components', element: <BaseComponentsView /> },
      { path: 'architecture/:id', element: <ArchitectureView /> },
      { path: 'component/:id', element: <InstanceComponentView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" replace />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
