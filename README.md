# Pops-Bops
a full stack app to generate satisfying short sounds


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