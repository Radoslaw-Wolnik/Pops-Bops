# Backend Documentation 

## Database Models

Our application uses MongoDB with Mongoose as the ODM (Object Document Mapper). Below are the main models and their interactions:

### User Model

**File**: `src/models/User.ts`

The User model represents the application users.

```typescript
interface IUserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  role: 'user' | 'admin';
}
```

- `username` and `email` are unique fields.
- `password` is hashed before storage.
- `isVerified` indicates whether the user's email has been verified.
- `role` can be either 'user' or 'admin'.

### AudioSample Model

**File**: `src/models/AudioSample.ts`

The AudioSample model is a base model for audio samples.

```typescript
interface IAudioSampleDocument extends Document {
  name: string;
  audioUrl: string;
  iconUrl: string;
  createdAt?: Date;
  sampleType: 'DefaultAudioSample' | 'UserAudioSample';
}
```

This model uses Mongoose's discriminator feature to create two sub-models:

#### DefaultAudioSample Model

**File**: `src/models/DefaultAudioSample.ts`

Represents audio samples provided by the application.

```typescript
interface IDefaultAudioSampleDocument extends IAudioSampleDocument {
  forMainPage: boolean;
}
```

- `forMainPage` indicates whether this sample should be displayed on the main page.

#### UserAudioSample Model

**File**: `src/models/UserAudioSample.ts`

Represents audio samples uploaded by users.

```typescript
interface IUserAudioSampleDocument extends IAudioSampleDocument {
  user: Types.ObjectId;
}
```

- `user` is a reference to the User who uploaded this sample.

### Collection Model

**File**: `src/models/Collection.ts`

The Collection model represents a group of audio samples created by a user.

```typescript
interface ICollectionDocument extends Document {
  user: Types.ObjectId;
  name: string;
  samples: Types.ObjectId[];
}
```

- `user` is a reference to the User who created this collection.
- `samples` is an array of references to AudioSample documents.

### RevokedToken Model

**File**: `src/models/RevokedToken.ts`

The RevokedToken model is used to store tokens that have been revoked (e.g., on user logout).

```typescript
interface IRevokedTokenDocument extends Document {
  token: string;
  expiresAt: Date;
}
```

## Model Interactions

1. **User and UserAudioSample**: 
   - A User can have multiple UserAudioSamples (one-to-many relationship).
   - The UserAudioSample model has a `user` field that references the User who created it.

2. **User and Collection**:
   - A User can have multiple Collections (one-to-many relationship).
   - The Collection model has a `user` field that references the User who created it.

3. **Collection and AudioSample**:
   - A Collection can contain multiple AudioSamples (many-to-many relationship).
   - The Collection model has a `samples` field that is an array of references to AudioSample documents.

4. **AudioSample Inheritance**:
   - DefaultAudioSample and UserAudioSample both inherit from the AudioSample model.
   - They use Mongoose's discriminator feature to add specific fields while sharing the same collection in the database.

5. **User and RevokedToken**:
   - There's no direct reference between User and RevokedToken in the schema.
   - However, RevokedToken is used in the authentication process to invalidate tokens when a user logs out.

## Database Connection

The database connection is managed in the `database.ts` file. It uses environment variables for configuration and includes retry logic to handle connection failures.

## Database Initialization

The `init-mongo.js` script is used to initialize the MongoDB database. It creates:
1. A root user for the admin database.
2. An application user with read and write permissions for the specific database used by the application.

This script uses environment variables to set up the users securely.


## Authentication (auth.ts)

The authentication system is implemented in `src/middleware/auth.ts`. Here are the key components:

### Token Generation and Management

1. `generateToken(user)`: Creates a JWT token for a user, valid for 1 hour.
2. `generateShortLivedToken(user)`: Creates a short-lived JWT token (5 minutes) for temporary authentication.
3. `setTokenCookie(res, token)`: Sets the JWT token as an HTTP-only cookie.
4. `setShortLivedTokenCookie(res, token)`: Sets a short-lived token as an HTTP-only cookie.

### Middleware Functions

1. `authenticateAdmin`: Verifies that the request is from an authenticated admin user.
2. `authenticateToken`: Verifies that the request includes a valid authentication token.
3. `handlePostRegistrationAuth`: Handles authentication immediately after user registration using a short-lived token.

### Token Refresh

`refreshToken`: Generates a new token for a user with a valid existing token.

### Security Features

- Tokens are stored as HTTP-only cookies for better security against XSS attacks.
- The system checks for revoked tokens using the `RevokedToken` model.
- Admin authentication checks the user's role in the database to ensure it's up-to-date.

## File Upload (upload.ts and uploadCombined.ts)

File upload is managed using Multer, configured in `src/middleware/upload.ts` and `src/middleware/uploadCombined.ts`.

### Storage Configuration

Separate storage configurations are created for audio files, icons, and profile pictures. Each configuration specifies:
- Destination folder (with separate paths for user and admin uploads)
- Filename generation (using user ID and timestamp)

### File Filters

File filters are implemented to restrict uploads to specific file types:
- Audio: .wav, .mp3, .ogg
- Icons: .png
- Profile pictures: .jpeg, .jpg, .png, .gif

### Upload Middlewares

1. `uploadProfilePicture`: For uploading user profile pictures.
2. `uploadAudio`: For uploading audio files.
3. `uploadIcon`: For uploading icon files.
4. `uploadAudioAndIcon`: A combined middleware for uploading both audio and icon files simultaneously.

### File Size Limits

- Audio files: 10 MB
- Icons: 2 MB
- Profile pictures: 5 MB

## Upload Folder Structure

The application uses a structured approach to organize uploaded files. Here's an overview of the upload folder structure:

```
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
```

### Explanation

1. **audio/**
   - **default/**: Contains audio samples uploaded by administrators. These are typically pre-set samples available to all users.
   - **user/**: Stores audio samples uploaded by regular users. Each user's uploads are kept separate.

2. **icons/**
   - **default/**: Houses icons uploaded by administrators. These are used for the main page and preset collections.
   - **user/**: Contains icons created or uploaded by regular users, typically for their custom collections or samples.

3. **profile_pictures/**
   - Stores profile pictures uploaded by all users. This folder is not subdivided as each user only has one profile picture.

### Usage Notes

- The separation of `default/` and `user/` folders in `audio/` and `icons/` allows for easy management and distinction between admin-provided content and user-generated content.
- Only administrators have permission to upload files to the `default/` folders.
- Regular users can only upload to the `user/` folders and the `profile_pictures/` folder.
- This structure is reflected in the file upload middleware (`upload.ts` and `uploadCombined.ts`), which determines the appropriate upload path based on the user's role and the type of file being uploaded.

### Security Considerations

- Ensure that proper access controls are in place to prevent unauthorized access to these folders.
- Implement regular backups of the `uploads/` directory to prevent data loss.
- Consider implementing a cleanup routine to remove unused or old files, especially in the `user/` folders, to manage storage efficiently.


## Email Sending (sendEmail.ts)

Email functionality is implemented in `utils/sendEmail.ts` using Nodemailer.

### Configuration

The email transporter is configured using environment variables:
- `EMAIL_HOST`: SMTP host
- `EMAIL_PORT`: SMTP port
- `EMAIL_USER`: SMTP username
- `EMAIL_PASS`: SMTP password
- `EMAIL_FROM`: Sender email address

### Usage

The `sendEmail` function accepts an object with:
- `to`: Recipient email address
- `subject`: Email subject
- `text`: Plain text content (optional)
- `html`: HTML content (optional)

### Error Handling

The function logs successful email sends and errors. If an error occurs during sending, it's thrown for the caller to handle.

### Development Setup

The file includes a commented-out development setup using Ethereal Email for testing without sending real emails.

## Utility: Cleanup of Revoked Tokens

A utility function `cleanupRevokedTokens` is provided in `utils/cleanupRevokedTokens.js`. This function deletes expired revoked tokens from the database. It should be run periodically (e.g., daily) using a task scheduler.


## Important Notes

1. **Security**: Ensure all sensitive information (JWT secret, email credentials) is stored in environment variables.
2. **Token Management**: Implement a strategy for token rotation and revocation in case of security breaches.
3. **File Upload**: Regularly clean up unused uploaded files to manage storage.
4. **Email**: In production, use a reliable email service provider to ensure deliverability.
5. **Error Handling**: Implement comprehensive error handling and logging throughout these systems.

- Ensure that all sensitive information (like database credentials) is stored in environment variables and not hard-coded in the application.
- The discriminator pattern used for AudioSamples allows for efficient querying of both default and user samples from a single collection while maintaining separate schemas.
- Proper indexing should be implemented on frequently queried fields (like `user` in UserAudioSample and Collection) to improve performance.
- Consider implementing data validation at the schema level to ensure data integrity.

---------------------
- [ ] set resource limits
- [ ] make helth checks

Additional Security Measures


Set resource limits:
Add resource limits to your services to prevent any single container from consuming all available resources:
yaml
services:
  mongo:
    ...
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M

Enable health checks:
Add health checks to ensure your services are running correctly:
services:
  mongo:
    ...
    healthcheck:
      test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5