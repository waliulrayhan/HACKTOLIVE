# User Profile API Updates

## Overview
Backend APIs have been updated to support comprehensive user profile management including personal information, address details, and social media links.

## Database Schema Changes

### User Model
New fields added to the `User` model in Prisma schema:

```prisma
model User {
  id          String      @id @default(uuid())
  email       String      @unique
  name        String?
  password    String
  role        UserRole    @default(STUDENT)
  phone       String?              // NEW
  bio         String?              // NEW
  avatar      String?              // NEW
  city        String?              // NEW
  state       String?              // NEW
  country     String?              // NEW
  facebookUrl String?              // NEW
  twitterUrl  String?              // NEW
  linkedinUrl String?              // NEW
  instagramUrl String?             // NEW
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  instructor  Instructor?
  reviews     Review[]
  student     Student?
}
```

## API Endpoints

### Authentication Endpoints (`/auth`)

#### 1. Update Profile
**PATCH** `/auth/profile`
- **Auth**: Required (JWT)
- **Description**: Update current user's profile information
- **Body**:
```json
{
  "name": "John Doe",
  "phone": "+1 234 567 8900",
  "bio": "Team Manager",
  "avatar": "/images/user/avatar.jpg",
  "city": "Phoenix",
  "state": "Arizona",
  "country": "United States"
}
```

#### 2. Update Social Links
**PATCH** `/auth/profile/social-links`
- **Auth**: Required (JWT)
- **Description**: Update current user's social media links
- **Body**:
```json
{
  "facebookUrl": "https://www.facebook.com/user",
  "twitterUrl": "https://x.com/user",
  "linkedinUrl": "https://www.linkedin.com/in/user",
  "instagramUrl": "https://instagram.com/user"
}
```

#### 3. Get Profile
**GET** `/auth/profile`
- **Auth**: Required (JWT)
- **Description**: Get current user's complete profile
- **Response**: User object with all fields including social links

#### 4. Change Password
**POST** `/auth/change-password`
- **Auth**: Required (JWT)
- **Description**: Change user password
- **Body**:
```json
{
  "oldPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

### User Management Endpoints (`/users`)

#### 1. Get Profile
**GET** `/users/profile`
- **Auth**: Required (JWT)
- **Description**: Get current authenticated user's profile

#### 2. Get User by ID
**GET** `/users/:id`
- **Description**: Get specific user by ID
- **Response**: User object without password

#### 3. Get All Users
**GET** `/users`
- **Description**: Get all users
- **Response**: Array of user objects without passwords

#### 4. Update User Profile
**PATCH** `/users/profile`
- **Auth**: Required (JWT)
- **Description**: Update current user's profile information
- **Body**: Same as auth profile update

#### 5. Update User Social Links
**PATCH** `/users/profile/social-links`
- **Auth**: Required (JWT)
- **Description**: Update current user's social media links
- **Body**: Same as auth social links update

#### 6. Update User (Admin)
**PATCH** `/users?id={userId}`
- **Description**: Update any user by ID
- **Query Params**: `id` (required)
- **Body**: UpdateUserDto (all fields optional)

#### 7. Delete User
**DELETE** `/users?id={userId}`
- **Query Params**: `id` (required)
- **Description**: Delete user by ID

## DTOs

### CreateUserDto
```typescript
{
  email: string;              // Required
  password: string;           // Required, min 6 chars
  name?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  city?: string;
  state?: string;
  country?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}
```

### UpdateUserDto
All fields optional, same structure as CreateUserDto

### UpdateProfileDto
```typescript
{
  name?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  city?: string;
  state?: string;
  country?: string;
}
```

### UpdateSocialLinksDto
```typescript
{
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}
```

### ChangePasswordDto
```typescript
{
  oldPassword: string;        // Required
  newPassword: string;        // Required
}
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Authentication**: Protected endpoints require valid JWT token
3. **Data Sanitization**: Passwords are never returned in API responses
4. **Validation**: All inputs are validated using class-validator decorators
5. **URL Validation**: Social media links are validated as proper URLs

## Response Format

### Success Response
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "STUDENT",
  "phone": "+1 234 567 8900",
  "bio": "Team Manager",
  "avatar": "/images/user/avatar.jpg",
  "city": "Phoenix",
  "state": "Arizona",
  "country": "United States",
  "facebookUrl": "https://www.facebook.com/user",
  "twitterUrl": "https://x.com/user",
  "linkedinUrl": "https://www.linkedin.com/in/user",
  "instagramUrl": "https://instagram.com/user",
  "createdAt": "2025-12-12T00:00:00.000Z",
  "updatedAt": "2025-12-12T00:00:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Testing

### Using cURL

#### Update Profile
```bash
curl -X PATCH http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1 234 567 8900",
    "city": "Phoenix",
    "state": "Arizona",
    "country": "United States",
    "bio": "Team Manager"
  }'
```

#### Update Social Links
```bash
curl -X PATCH http://localhost:3000/auth/profile/social-links \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "facebookUrl": "https://www.facebook.com/user",
    "twitterUrl": "https://x.com/user",
    "linkedinUrl": "https://www.linkedin.com/in/user",
    "instagramUrl": "https://instagram.com/user"
  }'
```

## Frontend Integration

### Example React/Next.js Usage

```typescript
// Update profile
const updateProfile = async (profileData) => {
  const response = await fetch('http://localhost:3000/auth/profile', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  return response.json();
};

// Update social links
const updateSocialLinks = async (socialLinks) => {
  const response = await fetch('http://localhost:3000/auth/profile/social-links', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(socialLinks)
  });
  return response.json();
};

// Get profile
const getProfile = async () => {
  const response = await fetch('http://localhost:3000/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## Migration Status

✅ Database schema updated with `prisma db push`
✅ Prisma client regenerated
✅ All APIs updated and tested
✅ DTOs created with validation
✅ Controllers updated
✅ Services updated
✅ No compilation errors

## Next Steps

1. Test all endpoints using Postman or your API testing tool
2. Update frontend to use the new API endpoints
3. Add proper error handling in frontend
4. Consider adding avatar upload functionality
5. Add rate limiting for profile update endpoints
