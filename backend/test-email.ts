import { PrismaClient } from '@prisma/client';
import * as nodemailer from 'nodemailer';

const prisma = new PrismaClient();

async function testEmail() {
  console.log('🔍 Testing email system...\n');

  // Check email logs for your email
  console.log('📧 Checking email logs for: mdwaliulislamrayhan@gmail.com');
  const logs = await prisma.emailLog.findMany({
    where: {
      recipientEmail: 'mdwaliulislamrayhan@gmail.com',
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  if (logs.length === 0) {
    console.log('❌ No email logs found for this email address.');
    console.log('   This means the email was never attempted to be sent.\n');
  } else {
    console.log(`✅ Found ${logs.length} email log(s):\n`);
    logs.forEach((log, index) => {
      console.log(`Email #${index + 1}:`);
      console.log(`  Status: ${log.status}`);
      console.log(`  Subject: ${log.subject}`);
      console.log(`  From: ${log.fromEmail}`);
      console.log(`  Created: ${log.createdAt}`);
      console.log(`  Sent: ${log.sentAt || 'Not sent'}`);
      console.log(`  Failed: ${log.failedAt || 'No'}`);
      console.log(`  Error: ${log.errorMessage || 'None'}`);
      console.log('');
    });
  }

  // Test SMTP connection
  console.log('🔧 Testing SMTP connection...\n');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'noreply@hacktolive.net',
      pass: '*zoDm5C#k',
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');
  } catch (error) {
    console.log('❌ SMTP connection failed:');
    console.log(error.message);
    console.log('');
  }

  // Try sending a test email
  console.log('📨 Sending test email to: mdwaliulislamrayhan@gmail.com\n');
  
  try {
    const info = await transporter.sendMail({
      from: '"HackToLive Test" <noreply@hacktolive.net>',
      to: 'mdwaliulislamrayhan@gmail.com',
      subject: 'Test Email from HackToLive',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Test Email</h1>
          <p>This is a test email to verify the email system is working.</p>
          <p>If you receive this, the email system is functioning correctly.</p>
          <p>Date: ${new Date().toLocaleString()}</p>
        </body>
        </html>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    console.log('\n📬 Check your inbox (and spam folder) for the test email.');
  } catch (error) {
    console.log('❌ Failed to send test email:');
    console.log(error.message);
    console.log(error);
  }

  console.log('\n✅ Email system test completed.');
}

testEmail()
  .catch((e) => {
    console.error('Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
