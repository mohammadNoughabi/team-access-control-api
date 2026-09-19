# Team Access Control API

A backend API for a SaaS application that provides **authentication,
session management, teams, roles, permissions, and access control**.

The API is written in **TypeScript** and runs on **Node.js**.

## Tech Stack

-   Node.js
-   TypeScript
-   Express
-   PostgreSQL
-   Redis
-   JWT
-   bcryptjs
-   nodemailer
-   Zod
-   Pino
-   Swagger / OpenAPI
-   Vitest
-   ESLint
-   Prettier
-   Husky

## What This API Does

Users can:

-   Create an account
-   Verify their email
-   Log in with username or email
-   Log out
-   Refresh their session
-   Edit their account
-   Request a password reset
-   Reset their password

The API also provides the foundation for team-based access control:

-   Organizations / teams
-   Team members
-   Roles
-   Permissions
-   Invitations
-   Session management
-   Audit logs

## How Authentication Works

### 1. Register

A user creates an account with:

``` json
{
  "username": "mohammad",
  "email": "mohammad@example.com",
  "password": "password"
}
```

The password is hashed with `bcryptjs` and the user is stored in
PostgreSQL.

An email verification OTP is generated and temporarily stored in Redis
before being sent to the user's email.

``` text
Register
   ↓
Create user
   ↓
Hash password
   ↓
PostgreSQL
   ↓
Generate OTP
   ↓
Redis
   ↓
Send verification email by nodemailer
```

### 2. Verify Email

The user submits the OTP they received by email.

``` text
OTP
 ↓
Redis
 ↓
Validate
 ↓
Mark email as verified
```

The OTP is temporary and expires automatically.

### 3. Login

Users can log in using either their username or email:

``` text
username/email + password
```

After successful authentication, the API creates a session and
generates:

-   Access token
-   Refresh token

Both tokens are stored in **HTTP-only cookies**.

``` text
Login
  ↓
Validate credentials
  ↓
Create session
  ↓
Access JWT + Refresh JWT
  ↓
HTTP-only cookies
```

The access token is short-lived and is used for normal API requests.

The refresh token has a longer lifetime and is used to obtain a new
access token.

The access and refresh tokens use **different secret keys**.

### 4. Refresh Session

When the access token expires:

``` text
Refresh token
      ↓
Validate token
      ↓
Validate session
      ↓
Rotate refresh token
      ↓
Create new access token
```

Refresh-token rotation helps prevent a stolen refresh token from being
reused indefinitely.

### 5. Logout

When a user logs out:

``` text
Logout
  ↓
Revoke current session
  ↓
Clear authentication cookies
```

### 6. Forgot Password

A user can request a password reset using their email address.

``` text
Forgot password
      ↓
Generate reset token
      ↓
Store temporary token in Redis
      ↓
Send reset link by email
      ↓
User opens link
      ↓
Submit new password
      ↓
Validate token
      ↓
Change password
      ↓
Invalidate token
```

After a successful password reset, existing sessions can be revoked so
previously authenticated devices must log in again.

## Redis

Redis is used for short-lived data and security-related operations.

For example:

``` text
Email verification OTPs
Password reset tokens
Rate limiting
Temporary authentication data
```

PostgreSQL remains the primary database for persistent application data.

## Team Access Control

After authentication, users can belong to teams/organizations.

The authorization model is:

``` text
User
 ↓
Team / Organization
 ↓
Membership
 ↓
Role
 ↓
Permissions
```

For example:

``` text
Organization
     │
     ├── Alice → Owner
     │             ├── member.invite
     │             ├── member.remove
     │             └── role.manage
     │
     └── Bob → Member
                   └── project.read
```

When a user accesses a protected resource, the API checks their team
membership, role, and permissions.

## Security

The API uses several security mechanisms:

-   Password hashing with bcryptjs
-   Short-lived access tokens
-   Refresh tokens with rotation
-   HTTP-only cookies
-   CSRF protection
-   CORS
-   Redis-based rate limiting
-   Zod request validation
-   Temporary OTP/reset tokens
-   Session revocation
-   Audit logs

## API Documentation

Swagger / OpenAPI documentation is available through the API
documentation endpoint during development.

The API is versioned under:

``` text
/api/v1
```

## Main API Routes

### Authentication

``` text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh

POST /api/v1/auth/verify-email
POST /api/v1/auth/resend-verification

POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

### Account

``` text
GET   /api/v1/account/me
PATCH /api/v1/account
```

### Teams / Organizations

``` text
POST /api/v1/organizations
GET  /api/v1/organizations
GET  /api/v1/organizations/:organizationId
```

Additional endpoints can manage members, invitations, roles,
permissions, sessions, and audit logs.

## Project Flow

The overall system can be viewed as:

``` text
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
                    Authentication
                           │
                           ▼
                    ┌─────────────┐
                    │   Session   │
                    └──────┬──────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │ Team / Organization│
                 └─────────┬────────┘
                           │
                           ▼
                       Membership
                           │
                           ▼
                          Role
                           │
                           ▼
                      Permissions
                           │
                           ▼
                    Protected API
                           │
                           ▼
                      Audit Log
```

This project focuses on building a practical SaaS backend where
**authentication determines who the user is, while authorization
determines what that user is allowed to do**.
