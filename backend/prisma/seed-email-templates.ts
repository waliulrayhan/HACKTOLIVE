// How to Run?
// C:\Users\Rayhan\Desktop\HACKTOLIVE\backend> npx ts-node prisma/seed-email-templates.ts

import { PrismaClient, EmailTemplateType, EmailSender } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEmailTemplates() {
  console.log('🌱 Seeding email templates...');

  const templates = [
    {
      name: 'Registration OTP',
      slug: 'registration-otp',
      subject: 'Verify Your Email - HACKTOLIVE',
      type: 'OTP' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['name', 'code', 'expiryMinutes']),
      description: 'OTP email sent during user registration',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    .logo-light { display: block !important; }
    .logo-dark { display: none !important; }
    @media (prefers-color-scheme: dark) {
      .logo-light { display: none !important; }
      .logo-dark { display: block !important; }
    }
  </style>
</head>
      .logo-dark { display: block !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Email Verification Required</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for registering with HACKTOLIVE. To complete your account setup and ensure the security of your account, please verify your email address.</p>
          <p style="margin:0 0 25px;color:#666;font-size:14px;line-height:1.6">Please use the verification code below to complete your registration process:</p>
          <div style="background-color:#f9f9f9;border:2px dashed #84cc16;border-radius:6px;padding:20px;text-align:center;margin:0 0 25px">
            <p style="margin:0 0 5px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px">Verification Code</p>
            <p style="margin:0;color:#84cc16;font-size:32px;font-weight:700;letter-spacing:8px;font-family:monospace">{{code}}</p>
            <p style="margin:10px 0 0;color:#999;font-size:12px">Valid for {{expiryMinutes}} minutes</p>
          </div>
          <div style="background-color:#fff9e6;border-left:4px solid #fbbf24;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6"><strong>Security Notice:</strong> This code will expire in {{expiryMinutes}} minutes. Do not share this code with anyone. HACKTOLIVE staff will never ask for your verification code.</p>
          </div>
          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">If you did not attempt to register for a HACKTOLIVE account, please disregard this email. Your email address will not be used without verification.</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Need Help?</strong></p>
            <p style="margin:0;color:#666;font-size:13px">Contact our support team at <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px;display:flex;justify-content:center;align-items:center">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Login OTP',
      slug: 'login-otp',
      subject: 'Your Login Code - HACKTOLIVE',
      type: 'OTP' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['name', 'code', 'expiryMinutes']),
      description: 'OTP email sent during login',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Account Login Verification</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">We received a request to sign in to your HACKTOLIVE account. To complete the login process and ensure your account security, please use the verification code provided below.</p>
          <p style="margin:0 0 25px;color:#666;font-size:14px;line-height:1.6">Enter this code on the login verification page to access your account:</p>
          <div style="background-color:#f9f9f9;border:2px dashed #84cc16;border-radius:6px;padding:20px;text-align:center;margin:0 0 25px">
            <p style="margin:0 0 5px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px">Verification Code</p>
            <p style="margin:0;color:#84cc16;font-size:32px;font-weight:700;letter-spacing:8px;font-family:monospace">{{code}}</p>
            <p style="margin:10px 0 0;color:#999;font-size:12px">Valid for {{expiryMinutes}} minutes</p>
          </div>
          <div style="background-color:#fef2f2;border-left:4px solid #ef4444;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#991b1b;font-size:13px;font-weight:600">Security Alert</p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">If you did not attempt to log in to your account, please ignore this email and consider changing your password immediately. Someone may be trying to access your account without authorization.</p>
          </div>
          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">For your security, this code will expire in {{expiryMinutes}} minutes. Never share your verification code with anyone, including HACKTOLIVE staff.</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Need Assistance?</strong></p>
            <p style="margin:0;color:#666;font-size:13px">Contact our support team at <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px;display:flex;justify-content:center;align-items:center">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Password Reset OTP',
      slug: 'password-reset-otp',
      subject: 'Reset Your Password - HACKTOLIVE',
      type: 'OTP' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['name', 'code', 'expiryMinutes']),
      description: 'OTP email for password reset',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Password Reset Request</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">We received a request to reset the password for your HACKTOLIVE account. To proceed with resetting your password, please use the verification code provided below.</p>
          <p style="margin:0 0 25px;color:#666;font-size:14px;line-height:1.6">Enter this code on the password reset page to create a new password:</p>
          <div style="background-color:#f9f9f9;border:2px dashed #84cc16;border-radius:6px;padding:20px;text-align:center;margin:0 0 25px">
            <p style="margin:0 0 5px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px">Reset Code</p>
            <p style="margin:0;color:#84cc16;font-size:32px;font-weight:700;letter-spacing:8px;font-family:monospace">{{code}}</p>
            <p style="margin:10px 0 0;color:#999;font-size:12px">Valid for {{expiryMinutes}} minutes</p>
          </div>
          <div style="background-color:#fef2f2;border-left:4px solid #ef4444;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#991b1b;font-size:13px;font-weight:600">Important Security Information</p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">If you did not request a password reset, please ignore this email and ensure your account is secure. We recommend changing your password if you suspect unauthorized access to your account.</p>
          </div>
          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#333;font-size:13px;font-weight:600">Password Security Tips</p>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8">
              <li>Use a strong password with a mix of letters, numbers, and symbols</li>
              <li>Avoid using easily guessable information</li>
              <li>Don't reuse passwords from other accounts</li>
              <li>Consider using a password manager</li>
            </ul>
          </div>
          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">This verification code will expire in {{expiryMinutes}} minutes for security reasons. If you need a new code, please submit another password reset request.</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Need Help?</strong></p>
            <p style="margin:0;color:#666;font-size:13px">Contact our support team at <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px;display:flex;justify-content:center;align-items:center">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Welcome Email',
      slug: 'welcome-email',
      subject: 'Welcome to HACKTOLIVE! 🚀',
      type: 'GENERAL' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['name', 'email']),
      description: 'Welcome email after verification',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Welcome to HACKTOLIVE</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Welcome to HACKTOLIVE! We are thrilled to have you join our cybersecurity learning community. Your email address <strong>{{email}}</strong> has been successfully verified, and your account is now fully activated.</p>
          <p style="margin:0 0 25px;color:#666;font-size:14px;line-height:1.6">You now have complete access to all features and resources available on our platform.</p>
          
          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 15px;color:#333;font-size:14px;font-weight:600">What You Can Do Now</p>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8">
              <li>Explore our comprehensive course catalog and training programs</li>
              <li>Set up your profile and customize your learning preferences</li>
              <li>Join our community forums and connect with other learners</li>
              <li>Access free resources and learning materials</li>
              <li>Track your learning progress and achievements</li>
              <li>Enroll in courses and start your cybersecurity journey</li>
            </ul>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px">
            <tr><td align="center">
              <a href="https://hacktolive.net/dashboard" style="display:inline-block;background-color:#84cc16;color:#fff;text-decoration:none;padding:12px 30px;border-radius:6px;font-size:14px;font-weight:600">Access Your Dashboard</a>
            </td></tr>
          </table>

          <div style="background-color:#fff9e6;border-left:4px solid #fbbf24;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6"><strong>Getting Started Tip:</strong> Complete your profile information to get personalized course recommendations and connect with other professionals in your field.</p>
          </div>

          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">If you have any questions or need assistance getting started, our support team is here to help you every step of the way.</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Support Contact:</strong></p>
            <p style="margin:0 0 3px;color:#666;font-size:13px">Email: <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
            <p style="margin:0 0 15px;color:#666;font-size:13px">Website: <a href="https://hacktolive.net" style="color:#84cc16;text-decoration:none">www.hacktolive.net</a></p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">We look forward to supporting your learning journey!</p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px;display:flex;justify-content:center;align-items:center">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Career Application Received',
      slug: 'career-application-confirmation',
      subject: 'Application Received - HACKTOLIVE',
      type: 'GENERAL' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['name', 'position']),
      description: 'Confirmation email when someone applies for a job',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Application Received Successfully</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for your interest in joining the HACKTOLIVE team. We have successfully received your application for the <strong>{{position}}</strong> position.</p>
          <p style="margin:0 0 25px;color:#666;font-size:14px;line-height:1.6">This email confirms that your application has been submitted and is now under review by our recruitment team.</p>
          
          <table width="100%" cellpadding="12" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;margin:0 0 25px;font-size:14px">
            <tr>
              <td colspan="2" style="color:#333;font-weight:600;border-bottom:2px solid #84cc16;padding-bottom:10px">Application Details</td>
            </tr>
            <tr>
              <td style="color:#666;width:35%;border-bottom:1px solid #eee"><strong>Position:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{position}}</td>
            </tr>
            <tr>
              <td style="color:#666"><strong>Status:</strong></td>
              <td style="color:#333">Under Review</td>
            </tr>
          </table>

          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 15px;color:#333;font-size:14px;font-weight:600">What Happens Next?</p>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8">
              <li>Our hiring team will carefully review your application and resume</li>
              <li>We will assess your qualifications against the position requirements</li>
              <li>If your profile matches our needs, we will contact you for an interview</li>
              <li>You will receive updates on your application status via email</li>
            </ul>
          </div>

          <div style="background-color:#fff9e6;border-left:4px solid #fbbf24;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6"><strong>Timeline:</strong> Our standard recruitment process typically takes 1-2 weeks. We appreciate your patience during this time and will keep you informed of any developments.</p>
          </div>

          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">If you have any questions about your application or would like to provide additional information, please don't hesitate to contact our HR team.</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>HR Contact:</strong></p>
            <p style="margin:0 0 3px;color:#666;font-size:13px">Email: <a href="mailto:career@hacktolive.net" style="color:#84cc16;text-decoration:none">career@hacktolive.net</a></p>
            <p style="margin:0 0 15px;color:#666;font-size:13px">Website: <a href="https://hacktolive.net" style="color:#84cc16;text-decoration:none">www.hacktolive.net</a></p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">We appreciate your interest in HACKTOLIVE and look forward to reviewing your application.</p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px;display:flex;justify-content:center;align-items:center">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Contact Message Received',
      slug: 'contact-form-confirmation',
      subject: 'We Received Your Message - HACKTOLIVE',
      type: 'GENERAL' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['name']),
      description: 'Confirmation email when someone submits contact form',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Message Received Successfully</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for reaching out to HACKTOLIVE. We have successfully received your message and appreciate you taking the time to contact us.</p>
          <p style="margin:0 0 25px;color:#666;font-size:14px;line-height:1.6">This email serves as confirmation that your inquiry has been submitted to our support team and is now being reviewed.</p>
          
          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 15px;color:#333;font-size:14px;font-weight:600">What Happens Next?</p>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8">
              <li>Our support team will review your message carefully</li>
              <li>We will investigate your inquiry and gather necessary information</li>
              <li>You will receive a detailed response via email</li>
              <li>If needed, we may request additional information from you</li>
            </ul>
          </div>

          <div style="background-color:#fff9e6;border-left:4px solid #fbbf24;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 5px;color:#666;font-size:13px;line-height:1.6"><strong>Response Time:</strong></p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">Our support team typically responds within 24-48 hours during business days (Monday - Friday). We strive to provide you with the best assistance possible.</p>
          </div>

          <div style="background-color:#fef2f2;border-left:4px solid #ef4444;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 5px;color:#991b1b;font-size:13px;font-weight:600">Urgent Matters</p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">If your inquiry requires immediate attention or is time-sensitive, please contact us directly via email at support@hacktolive.net and mark your message as "Urgent" in the subject line.</p>
          </div>

          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">We value your communication and are committed to providing you with prompt and helpful support.</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Support Contact:</strong></p>
            <p style="margin:0 0 3px;color:#666;font-size:13px">Email: <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
            <p style="margin:0 0 15px;color:#666;font-size:13px">Website: <a href="https://hacktolive.net" style="color:#84cc16;text-decoration:none">www.hacktolive.net</a></p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">Thank you for choosing HACKTOLIVE!</p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px;display:flex;justify-content:center;align-items:center">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Application Status Update',
      slug: 'career-application-status',
      subject: 'Update on Your Application - HACKTOLIVE',
      type: 'GENERAL' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['name', 'position', 'status', 'message']),
      description: 'Status update email for job applications',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Application Status Update</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for your continued interest in joining HACKTOLIVE. We are writing to provide you with an important update regarding your application for the <strong>{{position}}</strong> position.</p>
          <p style="margin:0 0 25px;color:#666;font-size:14px;line-height:1.6">Your application has been reviewed by our hiring team, and we would like to inform you of its current status.</p>
          
          <div style="background-color:#f9f9f9;border:2px solid #84cc16;border-radius:6px;padding:25px;text-align:center;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600">Current Application Status</p>
            <p style="margin:0;color:#84cc16;font-size:22px;font-weight:700">{{status}}</p>
          </div>

          <table width="100%" cellpadding="12" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;margin:0 0 25px;font-size:14px">
            <tr>
              <td colspan="2" style="color:#333;font-weight:600;border-bottom:2px solid #84cc16;padding-bottom:10px">Application Details</td>
            </tr>
            <tr>
              <td style="color:#666;width:35%;border-bottom:1px solid #eee"><strong>Position:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{position}}</td>
            </tr>
            <tr>
              <td style="color:#666"><strong>Status:</strong></td>
              <td style="color:#333">{{status}}</td>
            </tr>
          </table>

          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#333;font-size:14px;font-weight:600">Details</p>
            <p style="margin:0;color:#666;font-size:14px;line-height:1.6">{{message}}</p>
          </div>

          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">If you have any questions regarding this update or need additional information about your application status, please feel free to contact our HR team.</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>HR Contact:</strong></p>
            <p style="margin:0 0 3px;color:#666;font-size:13px">Email: <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
            <p style="margin:0 0 15px;color:#666;font-size:13px">Website: <a href="https://hacktolive.net" style="color:#84cc16;text-decoration:none">www.hacktolive.net</a></p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">We appreciate your interest in HACKTOLIVE and thank you for your patience throughout this process.</p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px;display:flex;justify-content:center;align-items:center">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Course Enrollment Confirmation',
      slug: 'course-enrollment-confirmation',
      subject: 'Welcome to {{courseName}} - HACKTOLIVE Academy',
      type: 'COURSE_ENROLLMENT' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['studentName', 'courseName', 'courseSlug', 'enrollmentDate', 'courseUrl', 'instructorName', 'isFree']),
      description: 'Confirmation email sent when a student enrolls in a course',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Course Enrollment Confirmation</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{studentName}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for enrolling in <strong>{{courseName}}</strong> at HACKTOLIVE Academy. We are pleased to confirm that your enrollment has been successfully processed.</p>
          <p style="margin:0 0 30px;color:#666;font-size:14px;line-height:1.6">This email serves as confirmation of your registration and contains important information about your course.</p>
          
          <table width="100%" cellpadding="12" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;margin:0 0 25px;font-size:14px">
            <tr>
              <td colspan="2" style="color:#333;font-weight:600;border-bottom:2px solid #84cc16;padding-bottom:10px">Course Information</td>
            </tr>
            <tr>
              <td style="color:#666;width:35%;border-bottom:1px solid #eee"><strong>Course Name:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{courseName}}</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Instructor:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{instructorName}}</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Enrollment Date:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{enrollmentDate}}</td>
            </tr>
            <tr>
              <td style="color:#666"><strong>Access:</strong></td>
              <td style="color:#333">Immediate - Available Now</td>
            </tr>
          </table>

          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 15px;color:#333;font-size:14px;font-weight:600">Getting Started with Your Course</p>
            <p style="margin:0 0 10px;color:#666;font-size:13px;line-height:1.7">To begin your learning journey, please follow these steps:</p>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8">
              <li>Log in to your student dashboard using your registered credentials</li>
              <li>Navigate to "My Courses" to access your enrolled courses</li>
              <li>Review the course curriculum and learning objectives</li>
              <li>Download any required course materials or resources</li>
              <li>Complete the lessons at your own pace</li>
              <li>Track your progress through the course dashboard</li>
              <li>Participate in course discussions and community forums</li>
              <li>Complete assessments and quizzes to test your knowledge</li>
            </ul>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px">
            <tr><td align="center">
              <a href="{{courseUrl}}" style="display:inline-block;background-color:#84cc16;color:#fff;text-decoration:none;padding:12px 30px;border-radius:6px;font-size:14px;font-weight:600">Access Your Course</a>
            </td></tr>
          </table>

          <div style="background-color:#fff9e6;border-left:4px solid #fbbf24;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#333;font-size:14px;font-weight:600">Important Information</p>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8">
              <li>All course materials are available for the duration of your enrollment</li>
              <li>You can learn at your own pace and revisit lessons anytime</li>
              <li>Certificate of completion will be issued upon successfully finishing the course</li>
              <li>Technical support is available if you encounter any issues</li>
              <li>Course updates and announcements will be sent to your registered email</li>
            </ul>
          </div>

          <div style="border-top:1px solid #e5e7eb;padding-top:20px;margin-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">If you have any questions regarding your enrollment or need assistance accessing the course materials, please don't hesitate to contact our support team. We are here to help you succeed in your learning journey.</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Support Contact:</strong></p>
            <p style="margin:0 0 3px;color:#666;font-size:13px">Email: <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
            <p style="margin:0 0 15px;color:#666;font-size:13px">Website: <a href="https://hacktolive.net" style="color:#84cc16;text-decoration:none">www.hacktolive.net</a></p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">We wish you the best in your learning experience!</p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px;display:flex;justify-content:center;align-items:center">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE Academy. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Order Confirmation (Customer)',
      slug: 'order-confirmation-customer',
      subject: 'Order Confirmation #{{orderNumber}} - HACKTOLIVE Shop',
      type: 'ORDER_CONFIRMATION' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['customerName', 'orderNumber', 'orderDate', 'items', 'subtotal', 'shippingCost', 'tax', 'total', 'shippingAddress', 'orderUrl']),
      description: 'Confirmation email sent to customer when an order is placed',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Order Confirmed!</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{customerName}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.</p>
          
          <div style="background-color:#f9f9f9;border:2px solid #84cc16;border-radius:6px;padding:20px;text-align:center;margin:0 0 25px">
            <p style="margin:0 0 5px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px">Order Number</p>
            <p style="margin:0;color:#84cc16;font-size:28px;font-weight:700;letter-spacing:2px">{{orderNumber}}</p>
            <p style="margin:10px 0 0;color:#999;font-size:12px">{{orderDate}}</p>
          </div>

          <h2 style="margin:0 0 15px;color:#333;font-size:18px;border-bottom:2px solid #84cc16;padding-bottom:10px">Order Details</h2>
          
          <div style="margin:0 0 20px">{{items}}</div>

          <table width="100%" cellpadding="8" cellspacing="0" style="border-top:2px solid #e5e7eb;margin:0 0 25px">
            <tr>
              <td style="color:#666;text-align:right;padding-top:15px">Subtotal:</td>
              <td style="color:#333;text-align:right;padding-top:15px;font-weight:600;width:100px">{{subtotal}} BDT</td>
            </tr>
            <tr>
              <td style="color:#666;text-align:right">Shipping:</td>
              <td style="color:#333;text-align:right;font-weight:600">{{shippingCost}} BDT</td>
            </tr>
            <tr>
              <td style="color:#666;text-align:right">Tax:</td>
              <td style="color:#333;text-align:right;font-weight:600">{{tax}} BDT</td>
            </tr>
            <tr style="border-top:2px solid #84cc16">
              <td style="color:#333;text-align:right;padding-top:10px;font-size:16px;font-weight:700">Total:</td>
              <td style="color:#84cc16;text-align:right;padding-top:10px;font-size:18px;font-weight:700">{{total}} BDT</td>
            </tr>
          </table>

          <h3 style="margin:0 0 10px;color:#333;font-size:16px">Shipping Address</h3>
          <div style="background-color:#f9f9f9;padding:15px;border-radius:6px;margin:0 0 25px">
            <p style="margin:0;color:#666;font-size:14px;line-height:1.6">{{shippingAddress}}</p>
          </div>

          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#333;font-size:14px;font-weight:600">What's Next?</p>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8">
              <li>We'll send you an email when your order ships</li>
              <li>Track your order status in your account dashboard</li>
              <li>Expected delivery: 3-7 business days</li>
            </ul>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px">
            <tr><td align="center">
              <a href="{{orderUrl}}" style="display:inline-block;background-color:#84cc16;color:#fff;text-decoration:none;padding:12px 30px;border-radius:6px;font-size:14px;font-weight:600">View Order Details</a>
            </td></tr>
          </table>

          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Need Help?</strong></p>
            <p style="margin:0;color:#666;font-size:13px">Contact: <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'New Order Notification (Admin)',
      slug: 'new-order-admin-notification',
      subject: 'New Order Received #{{orderNumber}} - HACKTOLIVE Shop',
      type: 'GENERAL' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['orderNumber', 'orderDate', 'customerName', 'customerEmail', 'total', 'itemCount', 'orderUrl']),
      description: 'Notification email sent to admins when a new order is placed',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#1e40af;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">🛍️ New Order Received</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">A new order has been placed on HACKTOLIVE Shop!</p>
          
          <div style="background-color:#eff6ff;border:2px solid #1e40af;border-radius:6px;padding:20px;text-align:center;margin:0 0 25px">
            <p style="margin:0 0 5px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px">Order Number</p>
            <p style="margin:0;color:#1e40af;font-size:28px;font-weight:700;letter-spacing:2px">{{orderNumber}}</p>
            <p style="margin:10px 0 0;color:#999;font-size:12px">{{orderDate}}</p>
          </div>

          <table width="100%" cellpadding="12" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;margin:0 0 25px;font-size:14px">
            <tr>
              <td colspan="2" style="color:#333;font-weight:600;border-bottom:2px solid #1e40af;padding-bottom:10px">Order Summary</td>
            </tr>
            <tr>
              <td style="color:#666;width:40%;border-bottom:1px solid #eee"><strong>Customer:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{customerName}}</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Email:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{customerEmail}}</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Items:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{itemCount}}</td>
            </tr>
            <tr>
              <td style="color:#666"><strong>Total Amount:</strong></td>
              <td style="color:#1e40af;font-weight:700;font-size:16px">{{total}} BDT</td>
            </tr>
          </table>

          <div style="background-color:#fef3c7;border-left:4px solid #f59e0b;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6"><strong>Action Required:</strong> Please review this order and update the status accordingly. The customer is waiting for confirmation.</p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
            <tr><td align="center">
              <a href="{{orderUrl}}" style="display:inline-block;background-color:#1e40af;color:#fff;text-decoration:none;padding:12px 30px;border-radius:6px;font-size:14px;font-weight:600">View Order in Admin Panel</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Order Status Update',
      slug: 'order-status-update',
      subject: 'Order #{{orderNumber}} Status Update - {{status}}',
      type: 'GENERAL' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['customerName', 'orderNumber', 'status', 'statusMessage', 'trackingNumber', 'orderUrl']),
      description: 'Email sent when order status is updated',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Order Status Update</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{customerName}}</strong>,</p>
          <p style="margin:0 0 25px;color:#666;font-size:14px;line-height:1.6">We're writing to update you on the status of your order <strong>#{{orderNumber}}</strong>.</p>
          
          <div style="background-color:#f9f9f9;border:2px solid #84cc16;border-radius:6px;padding:25px;text-align:center;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600">Current Status</p>
            <p style="margin:0;color:#84cc16;font-size:24px;font-weight:700;text-transform:uppercase">{{status}}</p>
          </div>

          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0;color:#333;font-size:14px;line-height:1.6">{{statusMessage}}</p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px">
            <tr><td align="center">
              <a href="{{orderUrl}}" style="display:inline-block;background-color:#84cc16;color:#fff;text-decoration:none;padding:12px 30px;border-radius:6px;font-size:14px;font-weight:600">Track Your Order</a>
            </td></tr>
          </table>

          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">If you have any questions about your order, please feel free to contact us.</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Support:</strong></p>
            <p style="margin:0;color:#666;font-size:13px">Email: <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Certificate Issued',
      slug: 'certificate-issued',
      subject: '🎓 Congratulations! Certificate Earned - {{courseName}}',
      type: 'CERTIFICATE_ISSUED' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['studentName', 'courseName', 'instructorName', 'issuedDate', 'verificationCode', 'certificateUrl', 'verificationUrl']),
      description: 'Email sent when a certificate is issued to a student',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#7c3aed;padding:40px;text-align:center">
          <div style="font-size:48px;margin:0 0 10px">🎓</div>
          <h1 style="margin:0;color:#fff;font-size:26px">Congratulations!</h1>
          <p style="margin:10px 0 0;color:#fff;font-size:14px;opacity:0.9">You've Earned a Certificate</p>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{studentName}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">We are thrilled to inform you that you have successfully completed the course and earned your certificate!</p>
          
          <div style="background-color:#faf5ff;border:2px solid #7c3aed;border-radius:8px;padding:25px;text-align:center;margin:0 0 25px">
            <p style="margin:0 0 5px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px">Certificate For</p>
            <p style="margin:0 0 15px;color:#7c3aed;font-size:20px;font-weight:700">{{courseName}}</p>
            <p style="margin:0;color:#666;font-size:13px">Issued by <strong>{{instructorName}}</strong></p>
            <p style="margin:5px 0 0;color:#999;font-size:12px">{{issuedDate}}</p>
          </div>

          <table width="100%" cellpadding="12" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;margin:0 0 25px;font-size:14px">
            <tr>
              <td colspan="2" style="color:#333;font-weight:600;border-bottom:2px solid #7c3aed;padding-bottom:10px">Certificate Details</td>
            </tr>
            <tr>
              <td style="color:#666;width:40%;border-bottom:1px solid #eee"><strong>Course:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{courseName}}</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Instructor:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{instructorName}}</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Issued Date:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{issuedDate}}</td>
            </tr>
            <tr>
              <td style="color:#666"><strong>Verification Code:</strong></td>
              <td style="color:#7c3aed;font-family:monospace;font-weight:700">{{verificationCode}}</td>
            </tr>
          </table>

          <div style="background-color:#fef3c7;border-left:4px solid #f59e0b;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6"><strong>Share Your Achievement:</strong> You can verify the authenticity of this certificate using the verification code above at our verification portal.</p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px">
            <tr>
              <td align="center" style="padding:0 5px">
                <a href="{{certificateUrl}}" style="display:inline-block;background-color:#7c3aed;color:#fff;text-decoration:none;padding:12px 25px;border-radius:6px;font-size:14px;font-weight:600">Download Certificate</a>
              </td>
              <td align="center" style="padding:0 5px">
                <a href="{{verificationUrl}}" style="display:inline-block;background-color:#f9fafb;color:#7c3aed;border:2px solid #7c3aed;text-decoration:none;padding:10px 25px;border-radius:6px;font-size:14px;font-weight:600">Verify Certificate</a>
              </td>
            </tr>
          </table>

          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#333;font-size:14px;font-weight:600">Next Steps</p>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8">
              <li>Add this certificate to your LinkedIn profile</li>
              <li>Share your achievement on social media</li>
              <li>Include it in your professional resume</li>
              <li>Continue learning with our advanced courses</li>
            </ul>
          </div>

          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 15px;color:#666;font-size:13px;line-height:1.6">We're proud of your dedication and accomplishment. Keep up the excellent work in your learning journey!</p>
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Questions?</strong></p>
            <p style="margin:0;color:#666;font-size:13px">Contact: <a href="mailto:support@hacktolive.net" style="color:#7c3aed;text-decoration:none">support@hacktolive.net</a></p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE Academy. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Payment Receipt',
      slug: 'payment-receipt',
      subject: 'Payment Receipt #{{transactionId}} - HACKTOLIVE',
      type: 'ORDER_CONFIRMATION' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['customerName', 'transactionId', 'amount', 'currency', 'paymentDate', 'paymentMethod', 'courseName', 'cardType', 'cardIssuer', 'bankTransactionId']),
      description: 'Payment receipt sent when payment is successfully completed',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Payment Successful! ✓</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Dear <strong>{{customerName}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for your payment. This email confirms that we have successfully received your payment for <strong>{{courseName}}</strong>.</p>
          
          <div style="background-color:#f0fdf4;border:2px solid #84cc16;border-radius:6px;padding:20px;text-align:center;margin:0 0 25px">
            <p style="margin:0 0 5px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Transaction ID</p>
            <p style="margin:0;color:#84cc16;font-size:20px;font-weight:700;letter-spacing:1px;font-family:monospace">{{transactionId}}</p>
            <p style="margin:15px 0 5px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Amount Paid</p>
            <p style="margin:0;color:#333;font-size:32px;font-weight:700">{{amount}} {{currency}}</p>
            <p style="margin:10px 0 0;color:#666;font-size:12px">{{paymentDate}}</p>
          </div>

          <h2 style="margin:0 0 15px;color:#333;font-size:18px;border-bottom:2px solid #84cc16;padding-bottom:10px">Payment Details</h2>
          
          <table width="100%" cellpadding="12" cellspacing="0" style="background-color:#f9f9f9;border-radius:6px;margin:0 0 25px;font-size:14px">
            <tr>
              <td style="color:#666;width:40%;border-bottom:1px solid #eee"><strong>Course/Product:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{courseName}}</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Payment Method:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{paymentMethod}}</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Card Type:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee">{{cardType}} ({{cardIssuer}})</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Bank Transaction ID:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee;font-family:monospace;font-size:12px">{{bankTransactionId}}</td>
            </tr>
            <tr>
              <td style="color:#666;border-bottom:1px solid #eee"><strong>Transaction ID:</strong></td>
              <td style="color:#333;border-bottom:1px solid #eee;font-family:monospace;font-size:12px">{{transactionId}}</td>
            </tr>
            <tr>
              <td style="color:#666"><strong>Status:</strong></td>
              <td style="color:#84cc16;font-weight:600">✓ Completed</td>
            </tr>
          </table>

          <div style="background-color:#f0fdf4;border-left:4px solid #84cc16;padding:20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0 0 10px;color:#333;font-size:14px;font-weight:600">✓ What's Next?</p>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:13px;line-height:1.8">
              <li>You will receive a separate email with course access details</li>
              <li>Your enrollment has been automatically processed</li>
              <li>Course materials are now available in your student dashboard</li>
              <li>Keep this email as proof of payment for your records</li>
            </ul>
          </div>

          <div style="background-color:#fff9e6;border-left:4px solid #fbbf24;padding:15px 20px;border-radius:4px;margin:0 0 25px">
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6"><strong>Note:</strong> This is an automated receipt for your records. Please save this email for future reference. If you have any questions about this transaction, please contact our support team with your transaction ID.</p>
          </div>

          <div style="border-top:1px solid #e5e7eb;padding-top:20px">
            <p style="margin:0 0 5px;color:#666;font-size:13px"><strong>Need Help?</strong></p>
            <p style="margin:0 0 3px;color:#666;font-size:13px">Email: <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
            <p style="margin:0 0 15px;color:#666;font-size:13px">Website: <a href="https://hacktolive.net" style="color:#84cc16;text-decoration:none">www.hacktolive.net</a></p>
            <p style="margin:0;color:#666;font-size:13px;line-height:1.6">Thank you for choosing HACKTOLIVE Academy!</p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px;display:flex;justify-content:center;align-items:center">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE Academy. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
    {
      name: 'Newsletter Welcome',
      slug: 'newsletter-welcome',
      subject: 'Welcome to HackToLive Newsletter! 🎉',
      type: 'GENERAL' as EmailTemplateType,
      fromEmail: 'NOREPLY' as EmailSender,
      variables: JSON.stringify(['name', 'email']),
      description: 'Welcome email sent when user subscribes to newsletter',
      isActive: true,
      body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>.logo-light{display:block!important}.logo-dark{display:none!important}@media (prefers-color-scheme:dark){.logo-light{display:none!important}.logo-dark{display:block!important}}</style></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:28px">Welcome to HackToLive! 🚀</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">{{name}},</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for subscribing to the HackToLive newsletter! We're thrilled to have you join our community of cybersecurity enthusiasts and professionals.</p>
          <div style="background-color:#f0fdf4;border-left:4px solid #48bb78;padding:20px;margin:30px 0;border-radius:4px">
            <h3 style="margin:0 0 15px;color:#2d3748;font-size:16px">What to expect:</h3>
            <ul style="margin:0;padding-left:20px;color:#666;font-size:14px;line-height:1.8">
              <li>Latest cybersecurity insights and threat alerts</li>
              <li>Step-by-step tutorials and how-to guides</li>
              <li>Best security practices and compliance guides</li>
              <li>Exclusive content and early access to new courses</li>
              <li>Industry news and case studies</li>
            </ul>
          </div>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">You'll receive our newsletter regularly with valuable content to help you stay ahead in the ever-evolving world of cybersecurity.</p>
          <div style="text-align:center;margin:30px 0">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/blog" style="display:inline-block;background:#48bb78;color:#fff;padding:12px 30px;text-decoration:none;border-radius:5px;font-weight:bold">Explore Our Blog</a>
          </div>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Have questions or feedback? Feel free to reply to this email - we'd love to hear from you!</p>
          <div style="border-top:1px solid #e5e7eb;padding-top:20px;margin-top:30px">
            <p style="margin:0;color:#666;font-size:14px">Best regards,<br><strong>The HackToLive Team</strong></p>
          </div>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <div style="margin:0 0 10px">
            <img src="https://api.hacktolive.io/uploads/images/logo_black.png" alt="HACKTOLIVE" class="logo-light" style="display:block;width:120px;height:auto;margin:0 auto">
            <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" class="logo-dark" style="display:none;width:120px;height:auto;margin:0 auto">
          </div>
          <p style="margin:0 0 5px;color:#999;font-size:11px">You're receiving this email because you subscribed to HackToLive newsletter.</p>
          <p style="margin:0;color:#999;font-size:11px"><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email={{email}}" style="color:#4299e1;text-decoration:underline">Unsubscribe</a> from our mailing list.</p>
          <p style="margin:10px 0 0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    },
  ];

  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
    console.log(`✅ ${template.name}`);
  }

  console.log('\n✨ Email templates seeded successfully!');
}

seedEmailTemplates()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
