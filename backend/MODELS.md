# Models Documentation

This document provides an overview of the data models used in the Audio Sample Project.

## Table of Contents
1. [User](#user)
2. [AudioSample](#audiosample)
3. [DefaultAudioSample](#defaultaudiosample)
4. [UserAudioSample](#useraudiosample)
5. [Collection](#collection)
6. [RevokedToken](#revokedtoken)

## User

The User model represents registered users in the system.

### Schema

| Field | Type | Description |
|-------|------|-------------|
| username | String | Required, unique, 3-30 characters, alphanumeric with underscores and hyphens |
| email | String | Required, unique, encrypted |
| emailHash | String | Hashed email for faster lookups |
| password | String | Required, hashed, minimum 8 characters |
| profilePicture | String | Optional, URL of the user's profile picture |
| isVerified | Boolean | Indicates if the user's email is verified |
| verificationToken | String | Token for email verification |
| verificationTokenExpires | Date | Expiration date for the verification token |
| resetPasswordToken | String | Token for password reset |
| resetPasswordExpires | Date | Expiration date for the password reset token |
| role | String | User role, enum: ['user', 'admin'], default: 'user' |

### Methods

- `getDecryptedEmail()`: Decrypts and returns the user's email
- `comparePassword(candidatePassword)`: Compares a given password with the stored hashed password

### Statics

- `findByEmail(email)`: Finds a user by their email

### Hooks

- Pre-save hook: Hashes the password and encrypts the email before saving

## AudioSample

The AudioSample model is the base model for audio samples.

### Schema

| Field | Type | Description |
|-------|------|-------------|
| name | String | Required, 2-100 characters |
| audioUrl | String | Required, URL of the audio file |
| iconUrl | String | Optional, URL of the icon image |
| createdAt | Date | Automatically set to the current date |
| sampleType | String | Discriminator field for inheritance |

## DefaultAudioSample

The DefaultAudioSample model represents audio samples provided by the system.

### Schema

Inherits all fields from AudioSample, plus:

| Field | Type | Description |
|-------|------|-------------|
| forMainPage | Boolean | Indicates if the sample should be displayed on the main page |

## UserAudioSample

The UserAudioSample model represents audio samples uploaded by users.

### Schema

Inherits all fields from AudioSample, plus:

| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Reference to the User who uploaded the sample |

## Collection

The Collection model represents a collection of audio samples created by a user.

### Schema

| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Required, reference to the User who created the collection |
| name | String | Required, 2-100 characters |
| samples | [ObjectId] | Array of references to AudioSample documents |

## RevokedToken

The RevokedToken model keeps track of revoked JWT tokens.

### Schema

| Field | Type | Description |
|-------|------|-------------|
| token | String | Required, unique, the revoked token |
| expiresAt | Date | Required, expiration date of the token |

## Best Practices and Notes

1. **Data Validation**: All models include built-in validation for fields like required fields, string lengths, and valid URLs.

2. **Security**: 
   - User passwords are hashed before storage.
   - User emails are encrypted in the database.
   - JWT tokens can be revoked for enhanced security.

3. **Scalability**: 
   - The AudioSample model uses inheritance to differentiate between default and user samples.
   - Indexes are used on frequently queried fields like `emailHash` for better performance.

4. **Flexibility**:
   - The Collection model allows users to organize their samples.
   - The DefaultAudioSample model includes a `forMainPage` flag for easy content management.

5. **Maintenance**:
   - All models use timestamps for tracking creation and update times.
   - The RevokedToken model includes an expiration date to allow for automatic cleanup of old entries.
