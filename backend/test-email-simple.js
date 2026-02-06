const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🔍 Testing email system...\n');
  
  const accounts = [
    {
      name: 'NOREPLY',
      email: process.env.NOREPLY_EMAIL,
      password: process.env.NOREPLY_PASSWORD,
    },
    {
      name: 'SUPPORT', 
      email: process.env.SUPPORT_EMAIL,
      password: process.env.SUPPORT_PASSWORD,
    },
  ];

  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || true,
  };

  console.log('📧 SMTP Configuration:');
  console.log(`Host: ${smtpConfig.host}`);
  console.log(`Port: ${smtpConfig.port}`);
  console.log(`Secure: ${smtpConfig.secure}\n`);

  for (const account of accounts) {
    console.log(`\n📨 Testing ${account.name} Account:`);
    console.log(`Email: ${account.email}`);
    console.log(`Password: ${account.password ? '***' + account.password.slice(-4) : 'NOT SET'}`);
    
    if (!account.email || !account.password) {
      console.log(`❌ ${account.name} credentials not configured properly`);
      continue;
    }
    
    try {
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
          user: account.email,
          pass: account.password,
        },
        debug: false,
        logger: false,
      });

      // Test connection
      console.log(`\n⏳ Verifying connection for ${account.email}...`);
      await transporter.verify();
      console.log(`✅ ${account.name} account authenticated successfully!`);
      
      // Try sending test email
      console.log(`📧 Sending test email to waliulrayhan@gmail.com...`);
      
      const info = await transporter.sendMail({
        from: `"HackToLive Test" <${account.email}>`,
        to: 'waliulrayhan@gmail.com',
        subject: `Test Email from ${account.name} - ${new Date().toLocaleString()}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>✅ Email Test Success!</h1>
            <p>This test email was sent from <strong>${account.email}</strong></p>
            <p>Account: <strong>${account.name}</strong></p>
            <p>Date: <strong>${new Date().toLocaleString()}</strong></p>
            <p>If you receive this, the email system is working correctly.</p>
            <hr>
            <small>HackToLive Email System Test</small>
          </body>
          </html>
        `,
      });

      console.log(`✅ Test email sent successfully from ${account.name}!`);
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Response: ${info.response}`);
      
    } catch (error) {
      console.error(`❌ ${account.name} failed:`);
      console.error(`   Error: ${error.message}`);
      
      if (error.code === 'EAUTH') {
        console.log('\n💡 Authentication failed - possible issues:');
        console.log('  1. Password is incorrect');
        console.log('  2. Email account does not exist');
        console.log('  3. SMTP authentication is disabled in Hostinger hPanel');
        console.log('  4. Account might be locked or suspended');
      } else if (error.message.includes('554 5.7.1')) {
        console.log('\n💡 SMTP disabled in hPanel:');
        console.log('  1. Login to your Hostinger hPanel');
        console.log('  2. Go to Email section');
        console.log('  3. Enable SMTP for this domain');
        console.log('  4. Ensure email accounts are created and active');
      }
    }
  }
  
  console.log('\n✨ Email test completed!');
}

testEmail().catch(console.error);