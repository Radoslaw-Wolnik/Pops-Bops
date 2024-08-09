
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LandingPageLayout from './layouts/LandingPageLayout'

import Home from './pages/Home';
import About from './pages/About';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';

import AudioGenerator from './pages/AudioGeneratorPage';
import PresetManagerPage from './pages/PresetManagerPage';
import CollectionPage from './pages/CollectionPage';


import './style/All.css'
import './style/Modal.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/verify-email/:token', element: <VerifyEmail /> },
      {
        path: '/profile/:userId?',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      { path: '/generate', element: <ProtectedRoute><AudioGenerator /></ProtectedRoute> },
      { path: '/collections', element: <ProtectedRoute><CollectionPage /></ProtectedRoute> },
      { path: '/preset-manage', element: <ProtectedRoute><PresetManagerPage /></ProtectedRoute> }
    ],
  },
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
