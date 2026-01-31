@echo off
echo ========================================
echo SSLCommerz Payment Integration Setup
echo ========================================
echo.

echo Step 1: Installing backend dependencies...
cd backend
call npm install @nestjs/axios
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo Step 2: Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo Error: Failed to generate Prisma client
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

echo Step 3: Running database migration...
call npx prisma migrate dev --name add_payment_model
if errorlevel 1 (
    echo Error: Failed to run migration
    echo Try running: npx prisma migrate reset
    pause
    exit /b 1
)
echo ✓ Migration completed
echo.

echo ========================================
echo Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Add these to your backend/.env file:
echo    SSLCOMMERZ_STORE_ID=testbox
echo    SSLCOMMERZ_STORE_PASSWORD=qwertyui
echo    SSLCOMMERZ_IS_LIVE=false
echo    FRONTEND_URL=http://localhost:3000
echo    BACKEND_URL=http://localhost:4000
echo.
echo 2. Start the backend: npm run start:dev
echo 3. Start the frontend: cd ..\frontend ^&^& npm run dev
echo 4. Test by enrolling in a paid course
echo.
echo See SETUP_PAYMENT.md for detailed instructions
echo ========================================
pause
