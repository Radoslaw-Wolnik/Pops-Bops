## API Documentation

Our API provides endpoints for user authentication, trip management, and real-time collaboration. All endpoints are prefixed with `/api`.

### Authentication

#### Register a new user
- **POST** `/users/register`
- **Body**: `{ username, email, password }`
- **Response**: `{ message: "User registered successfully" }`

#### Login
- **POST** `/users/login`
- **Body**: `{ email, password }`
- **Response**: `{ token: "JWT_TOKEN", user: { ... } }`

#### Logout
- **POST** `/users/logout`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ message: "Logged out successfully" }`

#### Get user profile
- **GET** `/users/me`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Response**: `{ user: { ... } }`

### Main Function