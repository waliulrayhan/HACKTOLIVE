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
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Email Verification</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Hello <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 30px;color:#666;font-size:14px;line-height:1.5">Please use the following verification code to complete your registration:</p>
          <div style="background-color:#f9f9f9;border:2px dashed #84cc16;border-radius:6px;padding:20px;text-align:center;margin:0 0 30px">
            <p style="margin:0;color:#84cc16;font-size:32px;font-weight:700;letter-spacing:8px;font-family:monospace">{{code}}</p>
            <p style="margin:10px 0 0;color:#999;font-size:12px">Valid for {{expiryMinutes}} minutes</p>
          </div>
          <p style="margin:0 0 10px;color:#666;font-size:13px;line-height:1.5">If you didn't request this code, please ignore this email.</p>
          <p style="margin:0;color:#999;font-size:12px">Questions? Contact <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0 0 5px;color:#666;font-size:13px;font-weight:600">HACKTOLIVE</p>
          <p style="margin:0;color:#999;font-size:11px">© 2026 All rights reserved</p>
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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Login Verification</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Hello <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 30px;color:#666;font-size:14px;line-height:1.5">Use the following code to complete your login:</p>
          <div style="background-color:#f9f9f9;border:2px dashed #84cc16;border-radius:6px;padding:20px;text-align:center;margin:0 0 30px">
            <p style="margin:0;color:#84cc16;font-size:32px;font-weight:700;letter-spacing:8px;font-family:monospace">{{code}}</p>
            <p style="margin:10px 0 0;color:#999;font-size:12px">Valid for {{expiryMinutes}} minutes</p>
          </div>
          <p style="margin:0 0 10px;color:#666;font-size:13px;line-height:1.5">If you didn't attempt to login, please secure your account immediately.</p>
          <p style="margin:0;color:#999;font-size:12px">Questions? Contact <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0 0 5px;color:#666;font-size:13px;font-weight:600">HACKTOLIVE</p>
          <p style="margin:0;color:#999;font-size:11px">© 2026 All rights reserved</p>
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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Password Reset</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Hello <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 30px;color:#666;font-size:14px;line-height:1.5">Use the following code to reset your password:</p>
          <div style="background-color:#f9f9f9;border:2px dashed #84cc16;border-radius:6px;padding:20px;text-align:center;margin:0 0 30px">
            <p style="margin:0;color:#84cc16;font-size:32px;font-weight:700;letter-spacing:8px;font-family:monospace">{{code}}</p>
            <p style="margin:10px 0 0;color:#999;font-size:12px">Valid for {{expiryMinutes}} minutes</p>
          </div>
          <p style="margin:0 0 10px;color:#666;font-size:13px;line-height:1.5">If you didn't request a password reset, please ignore this email.</p>
          <p style="margin:0;color:#999;font-size:12px">Questions? Contact <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0 0 5px;color:#666;font-size:13px;font-weight:600">HACKTOLIVE</p>
          <p style="margin:0;color:#999;font-size:11px">© 2026 All rights reserved</p>
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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:40px 30px;text-align:center">
          <h1 style="margin:0 0 10px;color:#fff;font-size:28px">Welcome to HACKTOLIVE!</h1>
          <p style="margin:0;color:#fff;font-size:14px;opacity:0.9">Your journey begins here</p>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Hello <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for joining HACKTOLIVE! Your email <strong>{{email}}</strong> has been successfully verified.</p>
          <p style="margin:0 0 30px;color:#666;font-size:14px;line-height:1.6">You now have full access to our cybersecurity learning platform.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 30px">
            <tr><td align="center">
              <a href="https://hacktolive.net/dashboard" style="display:inline-block;background-color:#84cc16;color:#fff;text-decoration:none;padding:12px 30px;border-radius:6px;font-size:14px;font-weight:600">Get Started</a>
            </td></tr>
          </table>
          <p style="margin:0 0 10px;color:#666;font-size:13px;line-height:1.5">If you have any questions, feel free to reach out.</p>
          <p style="margin:0;color:#999;font-size:12px">Contact <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0 0 5px;color:#666;font-size:13px;font-weight:600">HACKTOLIVE</p>
          <p style="margin:0;color:#999;font-size:11px">© 2026 All rights reserved</p>
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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Application Received</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Hello <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for applying for the <strong>{{position}}</strong> position at HACKTOLIVE.</p>
          <p style="margin:0 0 30px;color:#666;font-size:14px;line-height:1.6">We have received your application and our team will review it carefully. We'll get back to you soon regarding the next steps.</p>
          <div style="background-color:#f9f9f9;border-left:4px solid #84cc16;padding:15px 20px;border-radius:4px;margin:0 0 30px">
            <p style="margin:0;color:#666;font-size:13px;line-height:1.5">Our hiring process typically takes 1-2 weeks. We appreciate your patience.</p>
          </div>
          <p style="margin:0;color:#999;font-size:12px">Questions? Contact <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0 0 5px;color:#666;font-size:13px;font-weight:600">HACKTOLIVE</p>
          <p style="margin:0;color:#999;font-size:11px">© 2026 All rights reserved</p>
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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Message Received</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Hello <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">Thank you for contacting HACKTOLIVE. We've received your message and will respond as soon as possible.</p>
          <p style="margin:0 0 30px;color:#666;font-size:14px;line-height:1.6">Our support team typically responds within 24-48 hours during business days.</p>
          <div style="background-color:#f9f9f9;border-left:4px solid #84cc16;padding:15px 20px;border-radius:4px;margin:0 0 30px">
            <p style="margin:0;color:#666;font-size:13px;line-height:1.5">If your inquiry is urgent, please call us or send a direct email to support@hacktolive.net</p>
          </div>
          <p style="margin:0;color:#999;font-size:12px">Best regards, HACKTOLIVE Team</p>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0 0 5px;color:#666;font-size:13px;font-weight:600">HACKTOLIVE</p>
          <p style="margin:0;color:#999;font-size:11px">© 2026 All rights reserved</p>
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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:8px;overflow:hidden">
        <tr><td style="background-color:#84cc16;padding:30px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Application Update</h1>
        </td></tr>
        <tr><td style="padding:40px 30px">
          <p style="margin:0 0 20px;color:#333;font-size:16px">Hello <strong>{{name}}</strong>,</p>
          <p style="margin:0 0 20px;color:#666;font-size:14px;line-height:1.6">We have an update regarding your application for the <strong>{{position}}</strong> position.</p>
          <div style="background-color:#f9f9f9;border:2px solid #84cc16;border-radius:6px;padding:20px;text-align:center;margin:0 0 30px">
            <p style="margin:0 0 10px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px">Application Status</p>
            <p style="margin:0;color:#84cc16;font-size:20px;font-weight:700">{{status}}</p>
          </div>
          <div style="background-color:#f9f9f9;border-left:4px solid #84cc16;padding:15px 20px;border-radius:4px;margin:0 0 30px">
            <p style="margin:0;color:#666;font-size:14px;line-height:1.6">{{message}}</p>
          </div>
          <p style="margin:0;color:#999;font-size:12px">Questions? Contact <a href="mailto:support@hacktolive.net" style="color:#84cc16;text-decoration:none">support@hacktolive.net</a></p>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0 0 5px;color:#666;font-size:13px;font-weight:600">HACKTOLIVE</p>
          <p style="margin:0;color:#999;font-size:11px">© 2026 All rights reserved</p>
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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
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
          <img src="https://api.hacktolive.io/uploads/images/logo_white.png" alt="HACKTOLIVE" style="width:120px;height:auto;margin:0 0 10px">
          <p style="margin:0 0 5px;color:#999;font-size:11px">Empowering Cybersecurity Professionals Worldwide</p>
          <p style="margin:0;color:#999;font-size:11px">© 2026 HACKTOLIVE. All rights reserved.</p>
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
