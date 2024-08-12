
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LandingPageLayout from './layouts/LandingPageLayout'

import HomePage from './pages/HomePage';
import About from './pages/About';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';

import AudioGenerator from './pages/AudioGeneratorPage';
import PresetManagerPage from './pages/PresetManagerPage';
import CollectionPage from './pages/CollectionPage';
import CreateSamplePage from './pages/CreateSamplePage';


import './style/All.css'
import './style/Modal.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <About /> },
      { path: '/verify-email/:token', element: <VerifyEmail /> },
      {
        path: '/profile/:userId?',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      { path: '/generate', element: <ProtectedRoute><AudioGenerator /></ProtectedRoute> },
      { path: '/collections', element: <ProtectedRoute><CollectionPage /></ProtectedRoute> },
      { path: '/preset-manage', element: <ProtectedRoute><PresetManagerPage /></ProtectedRoute> },
      { path: '/create-sample', element: <ProtectedRoute><CreateSamplePage /></ProtectedRoute> }
    ],
  },
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
