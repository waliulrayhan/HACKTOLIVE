import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSMTPAuth() {
  console.log('🔍 Testing SMTP Authentication...\n');
  
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
    
    try {
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
          user: account.email,
          pass: account.password,
        },
        debug: true, // Enable debug output
        logger: true, // Log to console
      });

      // Verify connection
      console.log(`\n⏳ Verifying connection for ${account.email}...`);
      await transporter.verify();
      console.log(`✅ ${account.name} account authenticated successfully!`);
      
    } catch (error) {
      console.error(`❌ ${account.name} account authentication failed:`);
      console.error(error.message);
      
      if (error.code === 'EAUTH') {
        console.log('\n💡 Possible issues:');
        console.log('  1. Password is incorrect');
        console.log('  2. Email account does not exist');
        console.log('  3. SMTP authentication is disabled in Hostinger');
        console.log('  4. Special characters in password need escaping');
        console.log('  5. Account might be locked or suspended');
      }
    }
  }
  
  console.log('\n\n✨ Test completed!');
}

testSMTPAuth().catch(console.error);
