# Pops-Bops
a full stack app to generate satisfying short sounds

uploads/
├── audio/
│   ├── default/
│   │   └── (default audio samples)
│   └── user/
│       └── (user-uploaded audio samples)
├── icons/
│   ├── default/
│   │   └── (default icons for main page and presets)
│   └── user/
│       └── (user-created icons)
└── profile_pictures/
    └── (user profile pictures)


------------------ also add https to be more secure


------------------ client side implementation for renewing session
Client-side Implementation:
On the client side, you'll need to implement logic to:


Store the token (securely, preferably in HttpOnly cookies)
Send the token with each request
Check the token's expiration time
Call the refresh token endpoint when the token is close to expiring (e.g., 5 minutes before expiration)

Here's a basic example of how you might implement this in JavaScript:
```Javascript
const checkTokenExpiration = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;

    if (timeUntilExpiration < 300000) { // Less than 5 minutes until expiration
      refreshToken();
    }
  }
};

const refreshToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Handle error (e.g., redirect to login page)
  }
};

// Call checkTokenExpiration periodically
setInterval(checkTokenExpiration, 60000); // Check every minute
```









-------------- Prompt
I have decided to pivot a little in my pops and bobs project and want to more focus on the design of frontend components using tailwind.css 

I want to make the main page to show the title, Pops and Bops and around the title there will be clickable icons that will make some satisfying sounds, idk how many. Every icon will be loaded from database but i want it to be anly clickable where the png is and not where the colorless background is

I also want to make it so that first there will appear the title and then the icons will show up and at the top the navigation bar will show

Also for title would it be better to make custom font or to make a png or what? What is a current way of doing such things?

Also i want to make a page with making your sounds via recording or chosing from presets from server or files and you can make an icon for it with simple editor that would pop up using useModal component

How should i edit my exsisting models to carry this functionality? 
How should i modify the backend?

Also for now i will be discarding the functionality of generating sounds using generators but i will extend in future to make them

And i want to still be able to make custom collections but first i want to make main collection with all users presets around a title just like the main home page but with diff title and buttons everywhere arround representing the samples

And some deafult icons that will be saved to the deafult samples 

How should i structue the uploads? so that its wisible that there are page default resets (for main page) and its icons and the user ones 
Im also uploading profile pictures

--------------------- Answer

Your pivot sounds like an interesting and engaging direction for your Pops and Bops project. Let's break down your ideas and discuss how to implement them:

1. Main Page Design:
 - Use Tailwind CSS for styling.
 - Create a centered title "Pops and Bops".
 - Surround the title with clickable icons that play sounds.
 - Make icons clickable only on the non-transparent parts of the PNG.
 - Animate the appearance of elements: title first, then icons, then navigation bar.

2. Title Design:
For the title, you have a few options:
 - Custom font: Use a web font or create a custom font file.
 - SVG: Create a scalable vector graphic of the title.

The current trend leans towards using custom fonts or SVGs for better performance and scalability. If you want unique typography, consider using an SVG.
(I will use SVG)

3. Sound Creation Page:
 - Allow users to record sounds or choose from presets.
 - Implement a simple icon editor using a modal (useModal component).

You'll need to create corresponding frontend components and routes to interact with these new backend endpoints. 
Remember to handle file uploads properly on the frontend and send the correct data to the backend.
For the icon editor, you can use a library like Fabric.js or create a simple custom editor using HTML5 Canvas. 
The useModal component can be used to display this editor in a modal when needed.
Lastly, don't forget to update your routing and navigation components to reflect these new pages and functionalities.


 -------------------------------------- lazy load
I have this authContext:

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister, getMe, ApiError } from '../services/api';
import { FullUser } from '../types';


export interface AuthContextType {
  user: FullUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  updateCurrentUser: (updatedUser: FullUser) => void;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);
  //const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiLogin({email, password});
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      await fetchUserData();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred during login');
      }
    }
  }, [fetchUserData]);

  const register = useCallback(async (email: string, username: string, password: string) => {
    try {
      const response = await apiRegister({ email, username, password });
      // You might want to set some state here to indicate successful registration
      // For example: setRegistrationSuccess(true);
      // but that would be global and i dont need it i think
      return response.data.message;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred during registration');
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await refreshAuthToken();
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    } catch (error) {
      // ... error handling
    }
  }, []);

  const updateCurrentUser = useCallback((updatedUser: FullUser) => {
    setUser(updatedUser);
  }, []);

  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateCurrentUser,
    setToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

Why is setToken cannotFind name error but i have it in the interface? 
ChatGPT

The error you're encountering occurs because while you've defined setToken in the AuthContextType interface, the actual setToken function itself isn't defined anywhere in your AuthProvider component. You commented out the line that initializes the token state and the setToken function:

ts

// const [token, setToken] = useState<string | null>(null);

As a result, the setToken function does not exist in the scope of your component, leading to the "cannot find name" error when you try to use it.

To resolve this issue, you need to uncomment that line so that setToken is actually defined:

ts

const [token, setToken] = useState<string | null>(null);

With this line uncommented, you will have both token and setToken available in your component, and the error should be resolved. Here's the corrected part of your code:

ts

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);  // <-- Uncommented this line

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // ... rest of the code
};

Now, setToken should be available for use within your component, and it will no longer throw the "cannot find name" error.
okay now in my api i have this function
export const refreshAuthToken = (): Promise<AxiosResponse<{ token: string }>> =>
  typedApi.post('/auth/refresh-token');
For refreshing the token
Should i use it here

  const refreshToken = useCallback(async () => {
    try {
      const response = await refreshAuthToken();
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    } catch (error) {
      // ... error handling
    }
  }, []);

Also should i export refresh token function or set token if i have refreshtoken component like that:
// TokenRefresh.tsx
import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const TokenRefresh: React.FC = () => {
  const { token, setToken } = useAuth();

  const checkTokenExpiration = useCallback(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration < 300000) {
        refreshAuthToken().then(response => {
          setToken(response.data.token);
        }).catch(error => {
          console.error('Failed to refresh token:', error);
        });
      }

      // Schedule next check
      const nextCheckTime = Math.min(timeUntilExpiration - 300000, 60000); // Check either 5 minutes before expiration or every minute, whichever comes first
      setTimeout(checkTokenExpiration, nextCheckTime);
    }
  }, [token, setToken]);

  useEffect(() => {
    const timeoutId = setTimeout(checkTokenExpiration, 60000); // Initial check after 1 minute
    return () => clearTimeout(timeoutId);
  }, [checkTokenExpiration]);

  return null; // This component doesn't render anything
};

export default TokenRefresh;
ChatGPT

To implement a robust token refresh mechanism in your React application, it's important to structure the refreshToken functionality in a way that it can be reused easily, especially if you have a TokenRefresh component like the one you’ve shown.
1. Using the refreshToken Function in AuthProvider

Yes, it makes sense to use the refreshAuthToken function inside your AuthProvider component's refreshToken function. This function will handle the logic for refreshing the token and updating the state accordingly.

Here’s how you can use it:

tsx

const refreshToken = useCallback(async () => {
  try {
    const response = await refreshAuthToken();
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Handle error, possibly logging the user out or showing a notification
  }
}, []);

2. Exporting refreshToken and setToken

If you plan to manage token refreshes externally (for example, from the TokenRefresh component), it makes sense to export both refreshToken and setToken from your AuthContext.

You can adjust the AuthContext to include the refreshToken function:

tsx

export interface AuthContextType {
  user: FullUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;  // Add this
  updateCurrentUser: (updatedUser: FullUser) => void;
  setToken: (token: string) => void;
}

// ... inside AuthProvider
const contextValue: AuthContextType = {
  user,
  token,
  loading,
  login,
  register,
  logout,
  refreshToken,  // Add this
  updateCurrentUser,
  setToken,
};

This allows you to use both refreshToken and setToken in your TokenRefresh component.
3. Adjusting TokenRefresh.tsx Component

With the refreshToken function available from the context, you can simplify the TokenRefresh component. Instead of directly calling refreshAuthToken, you should use the refreshToken function from the context:

tsx

// TokenRefresh.tsx
import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const TokenRefresh: React.FC = () => {
  const { token, refreshToken } = useAuth();  // Use refreshToken instead of setToken

  const checkTokenExpiration = useCallback(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration < 300000) {
        refreshToken().catch(error => {
          console.error('Failed to refresh token:', error);
        });
      }

      // Schedule next check
      const nextCheckTime = Math.min(timeUntilExpiration - 300000, 60000); // Check either 5 minutes before expiration or every minute, whichever comes first
      setTimeout(checkTokenExpiration, nextCheckTime);
    }
  }, [token, refreshToken]);

  useEffect(() => {
    const timeoutId = setTimeout(checkTokenExpiration, 60000); // Initial check after 1 minute
    return () => clearTimeout(timeoutId);
  }, [checkTokenExpiration]);

  return null; // This component doesn't render anything
};

export default TokenRefresh;

Summary

    Use refreshToken in AuthProvider: This centralizes the logic and makes it easier to maintain.
    Export refreshToken and setToken: This allows your TokenRefresh component or other components to trigger a token refresh or manually set the token.
    Simplify TokenRefresh.tsx: Use refreshToken from the context to handle token refreshing, reducing code duplication.

This setup ensures that your token refresh logic is reusable and centralized, making it easier to manage across your application.
okay im setting Auth to be used as custom hook and i want to mount the token refresher in a way so that it uses the least ammount of memory and the thread of my react app
I think it would be in that way the most benefitial but im not sure
What do you think?
Also if im using refresh token in tokenRefresh from useAuth then i dojnt need the setToken function to be exported from auth (as previously)?

My app.tsx

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

import AdminAddDefaultSoundPage from './pages/AdminAddDefaultSoundPage';
import AdminManagementPage from './pages/AdminManagementPage';
import TokenRefresh from './components/TokenRefresh';

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
      { path: '/create-sample', element: <ProtectedRoute><CreateSamplePage /></ProtectedRoute> },
    
      { path: '/admin/add-default-sound', element: <ProtectedRoute><AdminAddDefaultSoundPage /></ProtectedRoute> },
      { path: '/admin/manage', element: <ProtectedRoute><AdminManagementPage /></ProtectedRoute> }
    ],
  },
]);

// prev
//const App: React.FC = () => <RouterProvider router={router} />;

// now
const App: React.FC = () => (
  <>
    <TokenRefresh />
    <RouterProvider router={router} />
  </>
);

/* The normal AuthProvider context folded app look
 * const App: React.FC = () => (
 *   <AuthProvider>
 *     <TokenRefresh />
 *     <RouterProvider router={router} />
 *   </AuthProvider>
 * );
 */

export default App;
ChatGPT
Optimal Usage of TokenRefresh with Minimal Resource Impact

To ensure that TokenRefresh uses minimal memory and doesn't overly tax the performance of your React app, you can take the following considerations into account:

    Minimal Rendering and Updates:
        Ensure that TokenRefresh component doesn't trigger unnecessary re-renders or state updates.
        Use useCallback and useEffect effectively to minimize the component’s footprint and prevent redundant function creations on every render.

    Debouncing or Throttling Token Checks:
        While you’re already setting up a check every minute, you might want to ensure that this is the most efficient interval. Checking too frequently can consume unnecessary resources, but checking too infrequently might lead to the user experience being affected if a token expires without renewal.

    Single TokenRefresh Mount:
        As you've done, mounting TokenRefresh in App.tsx at the top level ensures it's only mounted once and remains active for the lifecycle of the app. This is efficient as it avoids remounting on every route change.

    Lazy Loading and Code Splitting:
        For the TokenRefresh component itself, ensure that it doesn’t load unnecessary dependencies or logic when it’s mounted. This can be achieved using React’s React.lazy and code splitting.

Modifying TokenRefresh with refreshToken from useAuth

Since you're already using refreshToken from the useAuth hook in TokenRefresh, you can omit the export of setToken from your context. The TokenRefresh component should manage the token refreshing without needing direct access to setToken.

Here's how you can adjust your code to align with these principles:
1. Final AuthProvider Setup

tsx

export interface AuthContextType {
  user: FullUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateCurrentUser: (updatedUser: FullUser) => void;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Token and user states
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const response = await refreshAuthToken();
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  }, []);

  // Context value
  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshToken,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

2. Updated TokenRefresh.tsx

tsx

import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const TokenRefresh: React.FC = () => {
  const { token, refreshToken } = useAuth();  // Removed setToken

  const checkTokenExpiration = useCallback(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration < 300000) {
        refreshToken().catch(error => {
          console.error('Failed to refresh token:', error);
        });
      }

      // Schedule next check
      const nextCheckTime = Math.min(timeUntilExpiration - 300000, 60000); // Check either 5 minutes before expiration or every minute, whichever comes first
      setTimeout(checkTokenExpiration, nextCheckTime);
    }
  }, [token, refreshToken]);

  useEffect(() => {
    const timeoutId = setTimeout(checkTokenExpiration, 60000); // Initial check after 1 minute
    return () => clearTimeout(timeoutId);
  }, [checkTokenExpiration]);

  return null; // This component doesn't render anything
};

export default TokenRefresh;

3. App.tsx Setup

Since TokenRefresh now uses useAuth to manage tokens, the updated App.tsx might look like this:

tsx

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPageLayout from './layouts/LandingPageLayout';
import HomePage from './pages/HomePage';
import About from './pages/About';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AudioGenerator from './pages/AudioGeneratorPage';
import PresetManagerPage from './pages/PresetManagerPage';
import CollectionPage from './pages/CollectionPage';
import CreateSamplePage from './pages/CreateSamplePage';
import AdminAddDefaultSoundPage from './pages/AdminAddDefaultSoundPage';
import AdminManagementPage from './pages/AdminManagementPage';
import TokenRefresh from './components/TokenRefresh';
import './style/All.css';
import './style/Modal.css';

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
      { path: '/create-sample', element: <ProtectedRoute><CreateSamplePage /></ProtectedRoute> },
      { path: '/admin/add-default-sound', element: <ProtectedRoute><AdminAddDefaultSoundPage /></ProtectedRoute> },
      { path: '/admin/manage', element: <ProtectedRoute><AdminManagementPage /></ProtectedRoute> }
    ],
  },
]);

const App: React.FC = () => (
  <>
    <TokenRefresh />
    <RouterProvider router={router} />
  </>
);

export default App;

Summary

    Keep TokenRefresh Mounted Once: Mount it at the top level to avoid unnecessary re-renders.
    Use refreshToken Instead of setToken: Centralize the token refresh logic and remove unnecessary exports.
    Efficient Checks: Ensure that token expiration checks are efficient and not overly frequent.

This approach ensures that the token refresh process is both efficient and scalable, minimizing resource usage while keeping your app secure.
how should i use the lay load? 
Lazy Loading and Code Splitting:

    For the TokenRefresh component itself, ensure that it doesn’t load unnecessary dependencies or logic when it’s mounted. This can be achieved using React’s React.lazy and code splitting.
In tokenRefresh.tsx
ChatGPT

Lazy loading and code splitting are techniques used in React to optimize the performance of your application by loading components only when they are needed. This can help reduce the initial load time of your app by splitting your code into smaller chunks and loading those chunks on demand.

For the TokenRefresh component, lazy loading isn't particularly necessary if the component is lightweight, as it doesn't have a large impact on performance by itself. However, if your TokenRefresh component is part of a larger set of components or has dependencies that are heavy, lazy loading can be beneficial.
Lazy Loading in React

To lazy load a component in React, you use React.lazy() and React.Suspense. Here’s how you can do it for the TokenRefresh component:
1. Lazy Load TokenRefresh

First, update the way you import TokenRefresh in App.tsx:

tsx

import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LandingPageLayout from './layouts/LandingPageLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const About = lazy(() => import('./pages/About'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Profile = lazy(() => import('./pages/Profile'));
const AudioGenerator = lazy(() => import('./pages/AudioGeneratorPage'));
const PresetManagerPage = lazy(() => import('./pages/PresetManagerPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const CreateSamplePage = lazy(() => import('./pages/CreateSamplePage'));
const AdminAddDefaultSoundPage = lazy(() => import('./pages/AdminAddDefaultSoundPage'));
const AdminManagementPage = lazy(() => import('./pages/AdminManagementPage'));


// Lazy load TokenRefresh
const TokenRefresh = lazy(() => import('./components/TokenRefresh'));


const App: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TokenRefresh />
    <RouterProvider router={router} />
  </Suspense>
);

React.lazy(): This function takes a function that dynamically imports a component, allowing React to split that component into a separate chunk. It only loads when it’s actually needed.

TokenRefresh: If the TokenRefresh component itself is light and doesn’t have heavy dependencies, lazy loading might not be necessary for it alone. However, if TokenRefresh is part of a larger feature set or if it includes additional dependencies that are not needed immediately on app load, then lazy loading makes sense.

Pages and Routes: Lazy loading is particularly effective for routes and large components, as shown with pages like HomePage, Profile, and others. These are good candidates for lazy loading since they are not always needed upfront.

 --------------------------------------


Security measures - https and http only cookies

Obtain an SSL/TLS certificate:

You can get a free certificate from Let's Encrypt or purchase one from a Certificate Authority.
For development, you can also create a self-signed certificate.
using openssl
> openssl genpkey -algorithm RSA -out privkey.pem
> openssl req -new -x509 -key privkey.pem -out cert.pem -days 365

if i want to simulate the letsencrypt
create fake private key for certification company
> openssl genpkey -algorithm RSA -out intermediate-key.pem
create fake certificate for them
> openssl req -new -x509 -key intermediate-key.pem -out intermediate-cert.pem -days 365
join fake certificate from company and my certificate
> cat cert.pem intermediate-cert.pem > fullchain.pem

----------- Firefox trust my cert
Configuring Firefox to trust your certificate:
To make Firefox trust your self-signed certificate:
a. Open Firefox and go to about:config
b. Search for "security.enterprise_roots.enabled" and set it to true
c. Search for "security.cert_pinning.enforcement_level" and set it to 0
d. Restart Firefox
Then, you need to add your certificate to Firefox:
a. Go to Firefox Preferences > Privacy & Security > Certificates
b. Click on "View Certificates"
c. Go to the "Authorities" tab
d. Click "Import" and select your certificate file
e. Check the box that says "Trust this CA to identify websites" and click OK
Remember
In production, you should use certificates from a trusted Certificate Authority.


------------------------ restructure middleware in backend
src/
├── controllers/
│   └── authController.js (login, logout, register, refreshToken, sendVerificationEmail, verifyEmail)
├── middleware/
│   └── auth.js (authenticateToken, authenticateAdmin)
└── utils/
    └── authUtils.js (generateToken, setTokenCookie)

And from that you can see that other mioddleware / utils functions should propably be restructured too


---------------------------- setting the private-key.pem and certificate.pem route as .env variables
SSL_KEY_PATH=/path/to/your/private-key.pem
SSL_CERT_PATH=/path/to/your/certificate.pem

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

Secure file permissions:
Ensure that the SSL/TLS key and certificate files have restrictive permissions. Only the user running the Node.js process should be able to read these files.
chmod 400 /path/to/your/private-key.pem
chmod 400 /path/to/your/certificate.pem

Use a secrets management service:
For more advanced setups, consider using a secrets management service like AWS Secrets Manager, HashiCorp Vault, or Docker secrets if you're using containerization.

Regular rotation:
Implement a process for regularly rotating your SSL/TLS certificates and keys.

Monitoring and logging:
Set up monitoring to alert you if there are any unauthorized attempts to access these files or if the certificates are nearing expiration.

## So now - TODO
- [x] redesigned entire backend
- [ ] restructure middleware/utils in backend
- [ ] the api documentation
- [ ] make scheduler for cleanupFunction for revoked tokens

- [ ] create admin acc (in populate db script)
- [ ] make populate db script so that there is admin account that can add bops but also so that there are things in db to begin with (bops on main page, icons etc)
- [ ] add some (5) sounds and icons (in populate)

- [ ] create svg titles
- [ ] create homepage with title and bops, pops
- [ ] create make pop bop with simple icon creator (make it pop)
- [ ] create my pops

- [ ] add request password reset to the login modal
- [ ] only request token reset if there is a token to begin with; start token refresh counter after login not after rendering the website

- [ ] create collections
- [ ] add to collections
- [ ] custom font for collections

- [ ] loading spinner
- [ ] styles for login singup
- [ ] mini icon maker canva for bops (make it pop page)


- [ ] make usage of docker secrets


-------------- backend cleanup discarded tokens often called a token blacklist

Your approach to cleaning up revoked tokens is good. When using Docker to containerize your database and backend, you have a few options for implementing the cleanup routine:

1. Within the backend container:
You can use a scheduler like node-cron within your Express application. This method keeps the cleanup process part of your main application.

import cron from 'node-cron';
import cleanupRevokedTokens from './utils/cleanupRevokedTokens';

// Run cleanup every day at midnight
cron.schedule('0 0 * * *', cleanupRevokedTokens);

2. Separate container for cleanup:
Create a separate Docker container that runs the cleanup script on a schedule. This keeps the cleanup process isolated from your main application.
Dockerfile for cleanup:
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "cleanupScript.js"]
Use Docker Compose to manage both containers:
version: '3'
services:
  app:
    build: .
    # ... other app configurations
  cleanup:
    build: 
      context: .
      dockerfile: Dockerfile.cleanup
    depends_on:
      - mongo
    environment:
      - MONGO_URI=mongodb://mongo:27017/yourdb

3. Docker Swarm or Kubernetes cron jobs:
If you're using orchestration tools, you can set up cron jobs that run in your cluster.
For Docker Swarm, you could use a service in your docker-compose.yml:
cleanup:
  image: your-cleanup-image
  deploy:
    restart_policy:
      condition: none
  command: /bin/sh -c "while true; do node cleanupScript.js; sleep 86400; done"
For Kubernetes, you'd use a CronJob resource.
4. External scheduler:
Use an external scheduling service (e.g., AWS CloudWatch Events with Lambda) to trigger the cleanup routine in your containerized application via an API endpoint.
