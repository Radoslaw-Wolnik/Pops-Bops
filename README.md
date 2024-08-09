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

So now
- [x] redesigned entire backend
- [ ] create svg titles
- [ ] create admin acc (in populate db script)
- [ ] add some (5) sounds and icons (either in populate or in admin add page)
- [ ] create homepage with title and bops, pops
- [ ] create make pop bop with simple icon creator
- [ ] create my pops

- [ ] create collections
- [ ] add to collections
- [ ] custom font for collections