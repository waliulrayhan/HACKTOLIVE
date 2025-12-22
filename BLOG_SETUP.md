# Blog Feature - Setup Instructions

## Important: Database Migration Required

The blog feature requires new database tables. Follow these steps carefully:

## Step 1: Stop All Running Services

Before running migrations, stop all running processes:
- Stop the backend server (Ctrl+C in the terminal)
- Close any database management tools (MySQL Workbench, phpMyAdmin, etc.)
- Wait a few seconds for processes to release file locks

## Step 2: Generate Prisma Client

Run in the backend directory:
```bash
cd backend
npx prisma generate
```

If you get a "permission denied" or "EPERM" error:
1. Close all terminals running the backend
2. Close your IDE and reopen it
3. Try again

## Step 3: Create Migration

```bash
npx prisma migrate dev --name add_blog_feature
```

This will:
- Create the Blog, BlogComment, and BlogLike tables
- Add all necessary indexes
- Update the Prisma Client

## Step 4: Verify Migration

Check that the migration was successful:
```bash
npx prisma studio
```

You should see the new tables:
- Blog
- BlogComment
- BlogLike

## Step 5: Start Services

1. Start the backend:
```bash
npm run start:dev
```

2. Start the frontend (in another terminal):
```bash
cd ../frontend
npm run dev
```

## Step 6: Access Admin Panel

1. Log in as an admin user
2. Navigate to `/admin/blogs`
3. Click "Create Blog" to add your first blog post

## Troubleshooting

### Migration Fails

If migration fails due to existing data:
```bash
# Option 1: Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Option 2: Apply schema changes manually
npx prisma db push
```

### Permission Errors

If you get EPERM errors:
1. Make sure no process is using the database
2. Close and reopen your terminal
3. Run as administrator (Windows)
4. Check antivirus isn't blocking file operations

### Schema Not Syncing

```bash
# Force regenerate client
npx prisma generate --force

# Then try migration again
npx prisma migrate dev --name add_blog_feature
```

## Environment Variables

Make sure you have these set:

**Backend (.env):**
```env
DATABASE_URL="mysql://user:password@localhost:3307/hacktolive"
JWT_SECRET="your-secret-key"
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Testing the Feature

### Test Blog Creation

1. Go to `/admin/blogs/create`
2. Fill in:
   - Title: "Test Blog Post"
   - Slug: Will auto-generate
   - Description: "This is a test blog post"
   - Author Name: "John Doe"
   - Category: Select one
   - Blog Type: Select one
   - Tags: Add at least one tag
   - Status: Set to "Published"

3. Click "Create Blog"

### Test Public View

1. Go to `/blog`
2. You should see your blog in the list
3. Click on it to view the full post
4. Check that filters work

### Test API Directly

You can test the API using curl or Postman:

```bash
# Get all blogs
curl http://localhost:3001/blog

# Get featured blogs
curl http://localhost:3001/blog/featured

# Get blog by slug
curl http://localhost:3001/blog/slug/test-blog-post
```

## Next Steps

After successful setup:

1. **Add Sample Blogs**: Create 5-10 blog posts for testing
2. **Test Filtering**: Try different category and type filters
3. **Test Search**: Search for keywords in titles and content
4. **Test Comments**: Add comment functionality to frontend
5. **Test Likes**: Implement like button in frontend
6. **Add Images**: Upload and add proper image URLs
7. **Rich Text**: Consider adding a WYSIWYG editor for content

## Database Schema Reference

```sql
-- Blog table structure
CREATE TABLE Blog (
    id VARCHAR(191) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    mainImage VARCHAR(500),
    metadata TEXT NOT NULL,
    content LONGTEXT,
    category ENUM(...) NOT NULL,
    blogType ENUM(...) NOT NULL,
    authorName VARCHAR(255) NOT NULL,
    authorAvatar VARCHAR(500),
    authorRole VARCHAR(255),
    authorBio TEXT,
    authorTwitter VARCHAR(255),
    authorLinkedin VARCHAR(255),
    authorGithub VARCHAR(255),
    publishDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    readTime VARCHAR(50),
    tags TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') DEFAULT 'DRAFT',
    views INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
);
```

## Support

If you encounter any issues:
1. Check the BLOG_IMPLEMENTATION.md for detailed documentation
2. Verify all environment variables are set
3. Make sure MySQL is running on port 3307
4. Check backend logs for error messages
5. Verify Prisma client is generated (`node_modules/.prisma/client` should exist)
