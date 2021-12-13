/* eslint-disable */
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
import ProjectsView from 'src/views/projects/ProjectsView';
import QuestionsView from 'src/views/questions/QuestionsView';
import SettingsView from 'src/views/settings/SettingsView';
import ArchitectureView from 'src/views/architecture/ArchitectureView';
import InstanceComponentView from 'src/views/components/InstanceComponentView';
import BaseComponentsView from 'src/views/components/BaseComponentsView';

const routes = (isLoggedIn, project) => [
  {
    path: `/project/${project}`,
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" replace />,
    children: [
      { path: 'analytics', element: <AnalyticsView /> },
      { path: 'papers', element: <PaperListView /> },
      { path: 'questions', element: <QuestionsView /> },
      { path: 'components', element: <BaseComponentsView /> },
      { path: 'architecture/:id', element: <ArchitectureView /> },
      { path: 'component/:id', element: <InstanceComponentView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '/', element: <DashboardView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to={`/project/${project}/404`} /> }
    ]
  },
  {
    path: '/projects',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" replace />,
    children: [
      { path: '/', element: <ProjectsView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to={`/projects/404`}  /> }
    ]
  },
  {
    path: '/',
    element: !isLoggedIn ? <MainLayout /> : <Navigate to="/projects" replace />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to={`/project/${project}/dashboard`} /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
