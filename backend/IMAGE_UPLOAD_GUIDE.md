# Image Upload Implementation Guide

## Overview
This implementation stores images on the file system and saves the file path/URL in the MySQL database. This is the **recommended approach** for production applications as it's more efficient and scalable than storing binary data (BLOB) in the database.

## Architecture

### Storage Strategy
- **Files**: Stored in `backend/uploads/` directory
- **Database**: Only stores the file path (e.g., `/uploads/avatars/avatar-1234567890-5678.jpg`)
- **Access**: Files are served as static assets via Express

### Directory Structure
```
backend/
├── uploads/
│   ├── avatars/      # User profile pictures
│   ├── images/       # General images
│   └── documents/    # Other files
├── src/
│   └── upload/
│       ├── upload.module.ts
│       ├── upload.controller.ts
│       └── upload.service.ts
```

## API Endpoints

### 1. Upload Avatar
**POST** `/upload/avatar`

Upload and set user's profile avatar image.

**Authentication**: Required (JWT)

**Request**:
- Content-Type: `multipart/form-data`
- Field name: `file`
- Accepted formats: JPEG, PNG, GIF, WebP
- Max size: 5MB

**Response**:
```json
{
  "message": "Avatar uploaded successfully",
  "avatarUrl": "/uploads/avatars/avatar-1702345678-1234.jpg",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "/uploads/avatars/avatar-1702345678-1234.jpg"
  }
}
```

### 2. Upload Image
**POST** `/upload/image`

Upload a general image file.

**Authentication**: Required (JWT)

**Request**:
- Content-Type: `multipart/form-data`
- Field name: `file`
- Accepted formats: JPEG, PNG, GIF, WebP
- Max size: 5MB

**Response**:
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/images/img-1702345678-1234.jpg"
}
```

## Features

### File Validation
✅ File type validation (only images)
✅ File size validation (max 5MB)
✅ Automatic file naming with timestamps
✅ Duplicate prevention through unique filenames

### Security
✅ JWT authentication required
✅ File type whitelist
✅ Size limits to prevent abuse
✅ Sanitized file names
✅ No path traversal vulnerabilities

### Database Integration
✅ Automatically updates User.avatar field
✅ Syncs with Student/Instructor tables
✅ Stores only the URL path (not binary data)

## Testing

### Using cURL

#### Upload Avatar
```bash
curl -X POST http://localhost:3001/upload/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

#### Upload General Image
```bash
curl -X POST http://localhost:3001/upload/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### Using Postman

1. **Create a new POST request**
2. **Set URL**: `http://localhost:3001/upload/avatar`
3. **Headers**:
   - `Authorization`: `Bearer YOUR_JWT_TOKEN`
4. **Body**:
   - Select `form-data`
   - Add key: `file` (type: File)
   - Choose your image file
5. **Send request**

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new POST request
3. URL: `http://localhost:3001/upload/avatar`
4. Headers: Add `Authorization: Bearer YOUR_JWT_TOKEN`
5. Body: Select `Form` and add file field
6. Click Send

## Frontend Integration

### React/Next.js Example

```typescript
// Upload avatar
const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:3001/upload/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data;
};

// Usage in component
const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const result = await uploadAvatar(file);
    console.log('Avatar uploaded:', result.avatarUrl);
    // Update UI with new avatar
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// JSX
<input
  type="file"
  accept="image/*"
  onChange={handleAvatarUpload}
/>
```

### With Preview

```typescript
'use client';
import { useState } from 'react';

export default function AvatarUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3001/upload/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Uploaded:', data.avatarUrl);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {preview && (
        <img
          src={preview}
          alt="Avatar preview"
          className="w-32 h-32 rounded-full object-cover"
        />
      )}
      
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm"
      />
      
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

## Integration with Your UI Components

### UserMetaCard Component

Update your UserMetaCard component to include file upload:

```typescript
// Add this state and handler
const [uploading, setUploading] = useState(false);

const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setUploading(true);
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3001/upload/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await response.json();
    // Update user state with new avatar
    console.log('New avatar:', data.avatarUrl);
  } catch (error) {
    console.error('Upload failed:', error);
  } finally {
    setUploading(false);
  }
};

// Add file input to your modal
<div>
  <label>Change Avatar</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleAvatarChange}
    disabled={uploading}
  />
</div>
```

## File Naming Convention

Files are automatically renamed to prevent conflicts:

**Pattern**: `{prefix}{timestamp}-{random}{extension}`

Examples:
- Avatar: `avatar-1702345678901-5432.jpg`
- Image: `img-1702345678901-5432.png`

## File Access

Uploaded files are accessible via HTTP:

```
http://localhost:3001/uploads/avatars/avatar-1702345678-1234.jpg
http://localhost:3001/uploads/images/img-1702345678-5678.png
```

In production, these URLs will use your domain:
```
https://yourdomain.com/uploads/avatars/avatar-1702345678-1234.jpg
```

## Error Handling

### Common Errors

#### 1. No file uploaded
```json
{
  "statusCode": 400,
  "message": "No file uploaded",
  "error": "Bad Request"
}
```

#### 2. File too large
```json
{
  "statusCode": 400,
  "message": "File size must not exceed 5MB",
  "error": "Bad Request"
}
```

#### 3. Invalid file type
```json
{
  "statusCode": 400,
  "message": "Only image files (JPEG, PNG, GIF, WebP) are allowed",
  "error": "Bad Request"
}
```

#### 4. Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Production Considerations

### 1. Cloud Storage (Recommended for Production)

For production, consider using cloud storage:
- **AWS S3**: Most popular, reliable
- **Cloudinary**: Image optimization included
- **Google Cloud Storage**: Good integration
- **Azure Blob Storage**: Microsoft ecosystem

### 2. Image Processing

Add image processing for optimization:
```bash
npm install sharp
```

Then update the service to resize/compress images:
```typescript
import * as sharp from 'sharp';

async uploadAvatar(file: any): Promise<string> {
  this.validateImageFile(file);
  const filename = this.generateFileName(file, 'avatar-');
  const filepath = path.join(this.uploadPath, 'avatars', filename);
  
  // Optimize image
  await sharp(file.buffer)
    .resize(300, 300, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toFile(filepath);
  
  return this.getFileUrl(filename, 'avatars');
}
```

### 3. CDN Integration

For better performance, serve uploaded images through a CDN:
- CloudFlare
- AWS CloudFront
- Fastly

### 4. Backup Strategy

Implement automated backups of the uploads directory:
```bash
# Daily backup script
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
```

## Environment Variables

Add to your `.env` file:

```env
# Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR=uploads
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## Database Impact

The avatar field in your database stores only the path:

```sql
-- Before
avatar: NULL

-- After upload
avatar: "/uploads/avatars/avatar-1702345678-1234.jpg"
```

**Storage comparison**:
- Path in DB: ~50 bytes
- Image file: 50KB - 5MB (stored on disk)

This approach is much more efficient than storing images as BLOB.

## Monitoring

### Check disk usage
```bash
du -sh uploads/
```

### Count uploaded files
```bash
find uploads/ -type f | wc -l
```

### Clean old files (if needed)
```bash
# Delete files older than 30 days (adjust as needed)
find uploads/ -type f -mtime +30 -delete
```

## Security Checklist

✅ File type validation
✅ File size limits
✅ Sanitized file names
✅ Authentication required
✅ No executable files allowed
✅ Separate upload directory
✅ No direct path access
✅ CORS configured properly

## Troubleshooting

### Issue: Files not accessible
**Solution**: Ensure uploads directory exists and has proper permissions:
```bash
mkdir -p uploads/avatars uploads/images uploads/documents
chmod 755 uploads
```

### Issue: Upload fails silently
**Solution**: Check server logs and ensure multer is configured correctly

### Issue: File URL returns 404
**Solution**: Verify static file serving is configured in main.ts

## Next Steps

1. ✅ Test upload endpoints with Postman
2. ✅ Integrate with frontend components
3. ⬜ Add image optimization with sharp
4. ⬜ Implement cloud storage for production
5. ⬜ Add upload progress tracking
6. ⬜ Implement file deletion endpoint
7. ⬜ Add CDN integration
