# API Testing Guide

## Test the Updated User Profile APIs

### Prerequisites
1. Start the backend server:
```bash
cd backend
npm run start:dev
```

2. Get a JWT token by logging in or signing up

### Test 1: Get Current User Profile
```bash
GET http://localhost:3000/auth/profile
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
```

### Test 2: Update Profile Information
```bash
PATCH http://localhost:3000/auth/profile
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

Body:
{
  "name": "Musharof Chowdhury",
  "phone": "+09 363 398 46",
  "bio": "Team Manager",
  "city": "Phoenix",
  "state": "Arizona",
  "country": "United States",
  "avatar": "/images/user/owner.jpg"
}
```

### Test 3: Update Social Media Links
```bash
PATCH http://localhost:3000/auth/profile/social-links
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

Body:
{
  "facebookUrl": "https://www.facebook.com/PimjoHQ",
  "twitterUrl": "https://x.com/PimjoHQ",
  "linkedinUrl": "https://www.linkedin.com/company/pimjo",
  "instagramUrl": "https://instagram.com/PimjoHQ"
}
```

### Test 4: Get User by ID
```bash
GET http://localhost:3000/users/{userId}
```

### Expected Response Format
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "name": "Musharof Chowdhury",
  "role": "STUDENT",
  "phone": "+09 363 398 46",
  "bio": "Team Manager",
  "avatar": "/images/user/owner.jpg",
  "city": "Phoenix",
  "state": "Arizona",
  "country": "United States",
  "facebookUrl": "https://www.facebook.com/PimjoHQ",
  "twitterUrl": "https://x.com/PimjoHQ",
  "linkedinUrl": "https://www.linkedin.com/company/pimjo",
  "instagramUrl": "https://instagram.com/PimjoHQ",
  "createdAt": "2025-12-12T...",
  "updatedAt": "2025-12-12T..."
}
```

## Testing with Postman

1. **Import Collection**: Create a new Postman collection for User Profile APIs
2. **Set Environment Variables**:
   - `baseUrl`: http://localhost:3000
   - `token`: Your JWT token
3. **Test each endpoint** using the examples above

## Testing with Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new requests for each endpoint
3. Set Authorization header: `Bearer {{token}}`
4. Test and verify responses

## Integration with Frontend

Your UI components are ready! Just update the API calls to use these endpoints:

### UserInfoCard Component
- Edit button → PATCH `/auth/profile` with name, email, phone, bio
- Displays: name, email, phone, bio

### UserAddressCard Component  
- Edit button → PATCH `/auth/profile` with city, state, country
- Displays: city/state, country

### UserMetaCard Component
- Edit button → PATCH `/auth/profile/social-links`
- Displays: avatar, name, bio, location
- Social icons → Use the URLs from user profile

## Error Handling

Common errors and solutions:

### 401 Unauthorized
- Token expired or invalid
- Solution: Login again to get fresh token

### 404 Not Found
- User doesn't exist
- Solution: Check user ID

### 400 Bad Request
- Invalid data format
- Solution: Check request body matches DTO structure

### 409 Conflict
- Email already exists (for update)
- Solution: Use different email
