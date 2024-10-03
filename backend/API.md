# Audio Sample Project API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Admin Routes](#admin-routes)
3. [Audio Routes](#audio-routes)
4. [Auth Routes](#auth-routes)
5. [Collection Routes](#collection-routes)
6. [Health Routes](#health-routes)
7. [Icon Routes](#icon-routes)
8. [Job Routes](#job-routes)
9. [User Routes](#user-routes)

## Authentication

Most endpoints require authentication. Authentication is handled using HTTP-only cookies. When a user logs in successfully, the server will set a secure, HTTP-only cookie containing a session identifier. This cookie will be automatically included in subsequent requests to authenticated endpoints. Authentication requirement is indicated for each endpoint as follows:
 
 - 🔓 No authentication required
 - 🔒 User authentication required
 - 🔑 Admin authentication required

## Admin Routes

#### Get All Admins
```
🔑 GET /api/admin/all
Response: [Admin]
```

#### Delete Admin
```
🔑 DELETE /api/admin/:id
Response: { message: "Admin deleted successfully" }
```

#### Add Admin
```
🔑 POST /api/admin/add
Body: { username: string, password: string, email: string }
Response: Admin
```

## Audio Routes

#### Get Main Page Samples
```
🔓 GET /api/audio/main-samples
Response: [DefaultAudioSample]
```

#### Get User Samples
```
🔒 GET /api/audio/my-samples
Response: [UserAudioSample]
```

#### Upload Audio Sample
```
🔒 POST /api/audio/upload/sample
Body: FormData
Response: AudioSample
```

#### Upload Audio Sample with Icon
```
🔒 POST /api/audio/upload/sample-with-icon
Body: FormData
Response: AudioSample
```

#### Update Audio Sample
```
🔒 PUT /api/audio/sample/:id
Body: { name: string, forMainPage?: boolean }
Response: AudioSample
```

#### Delete Audio Sample
```
🔒 DELETE /api/audio/sample/:id
Response: { message: "Sample deleted successfully" }
```

#### Upload Default Audio Sample (Admin)
```
🔑 POST /api/audio/upload/default-sample
Body: FormData
Response: DefaultAudioSample
```

#### Upload Default Audio Sample with Icon (Admin)
```
🔑 POST /api/audio/upload/default-sample-with-icon
Body: FormData
Response: DefaultAudioSample
```

#### Delete Default Audio Sample (Admin)
```
🔑 DELETE /api/audio/default-sample/:id
Response: { message: "Sample deleted successfully" }
```

## Auth Routes

#### Register
```
🔓 POST /api/auth/register
Body: { username: string, email: string, password: string }
Response: { message: "User registered. Please check your email to verify your account." }
```

#### Login
```
🔓 POST /api/auth/login
Body: { email: string, password: string }
Response: { message: "Login successful", user: { id: string, role: string } }
```

#### Post-Registration Login
```
🔓 POST /api/auth/reg-login
Response: { message: "Login successful", user: { id: string, role: string, isVerified: boolean } }
```

#### Logout
```
🔒 POST /api/auth/logout
Response: { message: "Logout successful" }
```

#### Refresh Token
```
🔒 POST /api/auth/refresh-token
Response: { message: "Token refreshed successfully" }
```

#### Send Verification Email
```
🔒 POST /api/auth/send-verification
Response: { message: "Verification email sent" }
```

#### Verify Email
```
🔓 GET /api/auth/verify-email/:token
Response: { message: "Email verified successfully. You can now log in." }
```

#### Change Password
```
🔒 PUT /api/auth/change-password
Body: { currentPassword: string, newPassword: string }
Response: { message: "Password changed successfully" }
```

#### Request Password Reset
```
🔓 POST /api/auth/request-password-reset
Body: { email: string }
Response: { message: "Password reset email sent" }
```

#### Reset Password
```
🔓 POST /api/auth/reset-password/:token
Body: { password: string }
Response: { message: "Password reset successful" }
```

## Collection Routes

#### Get User Collections
```
🔒 GET /api/collections
Response: [Collection]
```

#### Get Collection by ID
```
🔒 GET /api/collections/:id
Response: Collection
```

#### Create Collection
```
🔒 POST /api/collections
Body: { name: string }
Response: Collection
```

#### Update Collection
```
🔒 PUT /api/collections/:id
Body: { name: string }
Response: Collection
```

#### Delete Collection
```
🔒 DELETE /api/collections/:id
Response: { message: "Collection deleted successfully" }
```

#### Add Samples to Collection
```
🔒 POST /api/collections/:id/add
Body: { sampleIds: string[] }
Response: Collection
```

#### Remove Sample from Collection
```
🔒 DELETE /api/collections/:collectionId/samples/:sampleId
Response: { message: "Sample removed from collection successfully" }
```

## Health Routes

#### Basic Health Check
```
🔓 GET /api/health
Response: { status: "OK" }
```

#### Detailed Health Check
```
🔓 GET /api/health/details
Response: { 
  uptime: number,
  message: string,
  timestamp: number,
  database: string
}
```

## Icon Routes

#### Upload Icon
```
🔒 POST /api/icons/upload
Body: FormData
Response: { message: "Icon uploaded successfully", iconPath: string }
```

#### Upload Default Icon (Admin)
```
🔑 POST /api/icons/upload-default
Body: FormData
Response: { message: "Icon uploaded successfully", iconPath: string }
```

#### Update Icon
```
🔒 PATCH /api/icons/update/:id
Body: FormData
Response: AudioSample
```

#### Update Default Icon (Admin)
```
🔑 PATCH /api/icons/update-default/:id
Body: FormData
Response: DefaultAudioSample
```

## Job Routes

#### Run Job
```
🔑 POST /api/jobs/:jobName
Response: { message: "Job completed successfully" }
```

#### Get Job Status
```
🔑 GET /api/jobs/:jobName/status
Response: { /* Job status details */ }
```

## User Routes

#### Get User's Own Profile
```
🔒 GET /api/users/me
Response: User
```

#### Upload Profile Picture
```
🔒 PUT /api/users/upload-profile-picture
Body: FormData
Response: { message: "Profile picture updated successfully", profilePicture: string }
```