const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSupportPasswords() {
  console.log('🔍 Testing SUPPORT account passwords...\n');
  
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@hacktolive.net';
  
  // Test different password variations
  const passwordVariations = [
    {
      name: 'Local .env password',
      password: 'h3DyniPw', // From local .env
    },
    {
      name: 'Server .env password', 
      password: 'h3DyniPw$$X', // From .env.server
    },
    {
      name: 'Current env password',
      password: process.env.SUPPORT_PASSWORD, // Current loaded password
    }
  ];

  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || true,
  };

  console.log('📧 SMTP Configuration:');
  console.log(`Host: ${smtpConfig.host}`);
  console.log(`Port: ${smtpConfig.port}`);
  console.log(`Secure: ${smtpConfig.secure}`);
  console.log(`Support Email: ${supportEmail}\n`);

  for (const variation of passwordVariations) {
    console.log(`\n🔐 Testing: ${variation.name}`);
    console.log(`Password: ${variation.password ? '***' + variation.password.slice(-4) : 'NOT SET'}`);
    
    if (!variation.password) {
      console.log('❌ Password not set, skipping...');
      continue;
    }
    
    try {
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
          user: supportEmail,
          pass: variation.password,
        },
        debug: false,
        logger: false,
      });

      // Test authentication only
      console.log(`⏳ Testing authentication...`);
      await transporter.verify();
      
      console.log(`✅ SUCCESS! ${variation.name} works!`);
      console.log(`   Correct password: ${variation.password}`);
      
      // Try sending a test email since authentication worked
      console.log(`📧 Sending test email to waliulrayhan@gmail.com...`);
      
      const info = await transporter.sendMail({
        from: `"HackToLive Support" <${supportEmail}>`,
        to: 'waliulrayhan@gmail.com',
        subject: `✅ Support Email Test Success - ${new Date().toLocaleString()}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>✅ Support Email Working!</h1>
            <p>This test email was sent from <strong>${supportEmail}</strong></p>
            <p>Password variation: <strong>${variation.name}</strong></p>
            <p>Password: <strong>${variation.password}</strong></p>
            <p>Date: <strong>${new Date().toLocaleString()}</strong></p>
            <p>Authentication and sending both successful!</p>
            <hr>
            <small>HackToLive Support Email Test</small>
          </body>
          </html>
        `,
      });

      console.log(`✅ Test email sent successfully!`);
      console.log(`   Message ID: ${info.messageId}`);
      
      // If we found a working password, we can stop testing
      break;
      
    } catch (error) {
      console.error(`❌ ${variation.name} failed:`);
      console.error(`   Error: ${error.message}`);
      
      if (error.code === 'EAUTH' || error.message.includes('authentication failed')) {
        console.log('   → Password is incorrect or account doesn\'t exist');
      } else if (error.message.includes('554 5.7.1')) {
        console.log('   → SMTP disabled in hPanel (but password might be correct)');
      }
    }
  }
  
  console.log('\n✨ Support password test completed!');
}

testSupportPasswords().catch(console.error);