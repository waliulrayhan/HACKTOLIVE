const nodemailer = require('nodemailer');

async function testServerCredentials() {
  console.log('🔍 Testing SERVER credentials from LOCAL machine...\n');
  
  // These are the actual credentials from the server
  const accounts = [
    {
      name: 'NOREPLY (Server)',
      email: 'noreply@hacktolive.net',
      password: '*zoDm5C#k',
    },
    {
      name: 'SUPPORT (Server)', 
      email: 'support@hacktolive.net',
      password: 'h3DyniPw$$X',
    },
  ];

  const smtpConfig = {
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
  };

  console.log('📧 Testing with server credentials:');
  console.log(`SMTP Host: ${smtpConfig.host}`);
  console.log(`SMTP Port: ${smtpConfig.port}`);
  console.log(`SMTP Secure: ${smtpConfig.secure}\n`);

  for (const account of accounts) {
    console.log(`📨 Testing ${account.name}:`);
    console.log(`Email: ${account.email}`);
    console.log(`Password: ***${account.password.slice(-4)}`);
    
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

      console.log(`⏳ Testing authentication for ${account.email}...`);
      await transporter.verify();
      console.log(`✅ ${account.name} authentication SUCCESSFUL!`);
      
      console.log(`📧 Sending test email to waliulrayhan@gmail.com...`);
      
      const info = await transporter.sendMail({
        from: `"HackToLive Test" <${account.email}>`,
        to: 'waliulrayhan@gmail.com',
        subject: `✅ LOCAL Test with SERVER Creds - ${account.name} - ${new Date().toLocaleString()}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>✅ Server Credentials Test Success!</h1>
            <p>This email was sent from <strong>LOCAL machine</strong> using <strong>SERVER credentials</strong></p>
            <p>From: <strong>${account.email}</strong></p>
            <p>Account: <strong>${account.name}</strong></p>
            <p>Password Used: <strong>***${account.password.slice(-4)}</strong></p>
            <p>Test Time: <strong>${new Date().toLocaleString()}</strong></p>
            <p>Status: <strong>Authentication and sending both successful!</strong></p>
            <hr>
            <small>HackToLive - Testing Server Credentials from Local Machine</small>
          </body>
          </html>
        `,
      });

      console.log(`✅ Test email sent successfully from ${account.name}!`);
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Server Password WORKS: ${account.password}`);
      
    } catch (error) {
      console.error(`❌ ${account.name} failed:`);
      console.error(`   Error: ${error.message}`);
      
      if (error.code === 'EAUTH' || error.message.includes('authentication failed')) {
        console.log('   → Authentication failed: Password incorrect or account doesn\'t exist');
      } else if (error.message.includes('554 5.7.1')) {
        console.log('   → SMTP disabled in hPanel (but password might be correct)');
        console.log(`   → Server Password: ${account.password}`);
      }
    }
    console.log('');
  }
  
  console.log('✨ Server credentials test completed!');
}

testServerCredentials().catch(console.error);