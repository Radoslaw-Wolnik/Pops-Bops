# API Documentation

## Table of Contents
- [Data Models](#data-models)
- [Global Types](#global-types)
- [Authentication](#authentication)
- [Error handling](#error-handling)
- [Admin Routes](#admin-routes)
- [Audio Routes](#audio-routes)
- [Collection Routes](#collection-routes)
- [Auth Routes](#auth-routes)
- [Icon Routes](#icon-routes)
- [User Routes](#user-routes)

## Data Models

This API interacts with the following high-level data models:

- Users: Represent registered users of the application
- AudioSamples: Represent audio files, including both default samples and user-uploaded samples
- Collections: Groups of audio samples created by users

For more detailed information about our data models and their interactions, please refer to backend documentation. `BACKEND_documentation.md`

## Global Types

```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  isVerified: boolean;
  role: 'user' | 'admin';
}

interface AudioSample {
  _id: string;
  name: string;
  audioUrl: string;
  iconUrl: string;
  settings: Record<string, any>;
  createdAt: Date;
}

interface UserAudioSample extends AudioSample {
  user: string; // User ID
}

interface DefaultAudioSample extends AudioSample {
  forMainPage: boolean;
}

interface Collection {
  _id: string;
  user: string; // User ID
  name: string;
  samples: string[]; // Array of AudioSample IDs
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

## Authentication

Most endpoints require authentication. Authentication is handled using HTTP-only cookies. When a user logs in successfully, the server will set a secure, HTTP-only cookie containing a session identifier. This cookie will be automatically included in subsequent requests to authenticated endpoints.
Authentication requirement is indicated for each endpoint as follows:

 - 🔒 Authentication required
 - 🔓 No authentication required
 - 👑 Admin authentication required


## Error Handling

All endpoints now use a centralized error handling system. Errors are returned in the following format:

```json
{
  "status": "error",
  "statusCode": number,
  "message": string
}
```

Common status codes:
 - 400: Bad Request
 - 401: Unauthorized
 - 403: Forbidden
 - 404: Not Found
 - 409: Conflict
 - 429: Too Many Requests
 - 500: Internal Server Error


## Admin Routes

### Get All Admins
```typescript
👑 GET /admin/users
Response: ApiResponse<User[]>
```

### Delete Admin
```typescript
👑 DELETE /admin/users/:id
Response: ApiResponse<{ message: string }>
```

### Add Admin
```typescript
👑 POST /admin/users
Body: { username: string; email: string; password: string }
Response: ApiResponse<User>
```

## Audio Routes

### Get Main Page Samples
```typescript
🔓 GET /audio/main-samples
Response: ApiResponse<DefaultAudioSample[]>
```

### Get User Samples
```typescript
🔒 GET /audio/my-samples
Response: ApiResponse<UserAudioSample[]>
```

### Save Audio Sample with Icon
```typescript
🔒 POST /audio/upload/sample-with-icon
Body: FormData (name: string, audio: File, icon: File)
Response: ApiResponse<UserAudioSample>
```

### Save Audio Sample
```typescript
🔒 POST /audio/upload/sample
Body: FormData (name: string, audio: File)
Response: ApiResponse<UserAudioSample>
```

### Update Audio Sample
```typescript
🔒 PUT /audio/sample/:id
Body: { name?: string; settings?: Record<string, any> }
Response: ApiResponse<UserAudioSample>
```

### Delete Audio Sample
```typescript
🔒 DELETE /audio/sample/:id
Response: ApiResponse<{ message: string }>
```

### Save Default Audio Sample with Icon (Admin)
```typescript
👑 POST /audio/upload/default-sample-with-icon
Body: FormData (name: string, audio: File, icon: File, forMainPage: boolean)
Response: ApiResponse<DefaultAudioSample>
```

### Save Default Audio Sample (Admin)
```typescript
👑 POST /audio/upload/default-sample
Body: FormData (name: string, audio: File, forMainPage: boolean)
Response: ApiResponse<DefaultAudioSample>
```

### Delete Default Audio Sample (Admin)
```typescript
👑 DELETE /audio/default-sample/:id
Response: ApiResponse<{ message: string }>
```


## Collection Routes

### Get User Collections
```typescript
🔒 GET /collections
Response: ApiResponse<Collection[]>
```

### Get Collection by ID
```typescript
🔒 GET /collections/:id
Response: ApiResponse<Collection>
```

### Create Collection
```typescript
🔒 POST /collections
Body: { name: string }
Response: ApiResponse<Collection>
```

### Update Collection
```typescript
🔒 PUT /collections/:id
Body: { name: string }
Response: ApiResponse<Collection>
```

### Delete Collection
```typescript
🔒 DELETE /collections/:id
Response: ApiResponse<{ message: string }>
```

### Add Samples to Collection
```typescript
🔒 POST /collections/:id/add
Body: { sampleIds: string[] }
Response: ApiResponse<Collection>
```

### Remove Sample from Collection
```typescript
🔒 DELETE /collections/:collectionId/samples/:sampleId
Response: ApiResponse<{ message: string }>
```


## Auth Routes

### Register
```typescript
🔓 POST /auth/register
Body: { username: string; email: string; password: string }
Response: ApiResponse<User>
```

### Login
```typescript
🔓 POST /auth/login
Body: { email: string; password: string }
Response: ApiResponse<{ user: User }>
```

### Post Registration Login
```typescript
🔓 POST /auth/reg-login
Body: { token: string } // a short lived token assigned after registration
Response: ApiResponse<{ user: User }>
```

### Logout
```typescript
🔒 POST /auth/logout
Response: ApiResponse<{ message: string }>
```

### Refresh Token
```typescript
🔒 POST /auth/refresh-token
Response: ApiResponse<{ token: string }>
```

### Send Verification Email
```typescript
🔒 POST /auth/send-verification
Response: ApiResponse<{ message: string }>
```

### Verify Email
```typescript
🔓 GET /auth/verify-email/:token
Response: ApiResponse<{ message: string }>
```

### Change Password
```typescript
🔒 PUT /auth/change-password
Body: { currentPassword: string; newPassword: string }
Response: ApiResponse<{ message: string }>
```

### Request Password Reset
```typescript
🔓 POST /auth/request-password-reset
Body: { email: string }
Response: ApiResponse<{ message: string }>
```

### Reset Password
```typescript
🔓 POST /auth/reset-password/:token
Body: { password: string }
Response: ApiResponse<{ message: string }>
```

## Icon Routes

### Upload Icon
```typescript
🔒 POST /icon/upload
Body: FormData
Response: ApiResponse<{ iconPath: string }>
```

### Upload Default Icon (Admin)
```typescript
👑 POST /icon/upload-default
Body: FormData
Response: ApiResponse<{ iconPath: string }>
```

### Update Icon
```typescript
🔒 PATCH /icon/update/:id
Body: FormData
Response: ApiResponse<AudioSample>
```

### Update Default Icon (Admin)
```typescript
👑 PATCH /icon/update-default/:id
Body: FormData
Response: ApiResponse<AudioSample>
```

## User Routes

### Get User's Own Profile
```typescript
🔒 GET /user/me
Response: ApiResponse<User>
```

### Upload Profile Picture
```typescript
🔒 PUT /user/upload-profile-picture
Body: FormData
Response: ApiResponse<{ profilePicture: string }>
```

## Rate Limiting
API requests are limited to 100 requests per IP address per hour. Exceeding this limit will result in a 429 (Too Many Requests) error.


## Examples
### Register a new user
Request
```typescript
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securepassword123"
}
```
Response
```typescript
{
  "data": {
    "_id": "60d5ecb74f52a1234b56789",
    "username": "newuser",
    "email": "newuser@example.com",
    "profilePicture": "",
    "isVerified": false,
    "role": "user"
  },
  "message": "User registered successfully"
}
```

### Login
Request
```typescript
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```
Response
```typescript
HTTP/1.1 200 OK
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
Content-Type: application/json

{
  "data": {
    "_id": "60d5ecb74f52a1234b56789",
    "username": "user",
    "email": "user@example.com",
    "profilePicture": "",
    "isVerified": true,
    "role": "user"
  },
  "message": "Login successful"
}
```

### Get User's Own Profile
Request
```typescript
GET /user/me
Cookie: session=abc123
```
Response
```typescript
{
  "data": {
    "_id": "60d5ecb74f52a1234b56789",
    "username": "user",
    "email": "user@example.com",
    "profilePicture": "",
    "isVerified": true,
    "role": "user"
  }
}
```

### Upload Audio
Request
```typescript
POST /audio/upload-audio
Cookie: session=abc123
Content-Type: multipart/form-data

[audio file data]
```
Response
```typescript
{
  "data": {
    "fileName": "mysong.mp3",
    "fileUrl": "https://storage.example.com/uploads/auidio/user/mysong-123456.mp3"
  },
  "message": "Audio uploaded successfully"
}
```

## Versioning

This documentation is for API version 1.0. The base URL for all endpoints is:
```
https://api.example.com/api
```

## Changelog

### Version 1.2 (2024-09-10)
- Updated error handling to use new custom error classes
- Updated upload routes to use `/upload` prefix
- Added logging information
- Updated authentication and file upload details

### Version 1.1 (2024-08-28)
- Updated routes and controllers to match the latest implementation
- Added new endpoints for icon management and collection operations
- Clarified authentication requirements for each endpoint

### Version 1.0 (2024-08-27)
- Initial API release