import * as path from 'path';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

type CliOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function loadEnvironment(): void {
  const envFiles = [
    path.resolve(process.cwd(), '.env.production'),
    path.resolve(process.cwd(), '.env'),
  ];

  for (const envFile of envFiles) {
    const result = dotenv.config({ path: envFile });

    if (!result.error) {
      return;
    }
  }
}

function parseCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    to: process.env.SMTP_TEST_TO || 'waliulrayhan@gmail.com',
    subject: process.env.SMTP_TEST_SUBJECT || 'HackToLive SMTP test',
    text:
      process.env.SMTP_TEST_TEXT ||
      'This is a test message to confirm HackToLive SMTP delivery is working.',
    html:
      process.env.SMTP_TEST_HTML ||
      '<p>This is a test message to confirm <strong>HackToLive SMTP delivery</strong> is working.</p>',
  };
  let recipientAssigned = false;

  for (const arg of args) {
    if (!arg.startsWith('--') && !recipientAssigned) {
      options.to = arg;
      recipientAssigned = true;
      continue;
    }

    const [key, ...valueParts] = arg.split('=');
    const value = valueParts.join('=');

    if (!value) {
      continue;
    }

    switch (key) {
      case '--to':
        options.to = value;
        break;
      case '--subject':
        options.subject = value;
        break;
      case '--text':
        options.text = value;
        break;
      case '--html':
        options.html = value;
        break;
      default:
        break;
    }
  }

  return options;
}

async function main(): Promise<void> {
  loadEnvironment();

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number.parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const username = process.env.SUPPORT_EMAIL || process.env.NOREPLY_EMAIL;
  const password = process.env.SUPPORT_PASSWORD || process.env.NOREPLY_PASSWORD;

  if (!smtpHost || !username || !password) {
    throw new Error(
      'Missing SMTP configuration. Set SMTP_HOST, SUPPORT_EMAIL/NOREPLY_EMAIL, and SUPPORT_PASSWORD/NOREPLY_PASSWORD.',
    );
  }

  const options = parseCliOptions();

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: username,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
  });

  console.log(`Checking SMTP connection to ${smtpHost}:${smtpPort}...`);
  await transporter.verify();
  console.log('SMTP verification passed. Sending test email...');

  const info = await transporter.sendMail({
    from: `"HackToLive" <${username}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  console.log('Test email sent successfully.');
  console.log(`Message ID: ${info.messageId}`);
  console.log(`Accepted: ${info.accepted.join(', ') || 'none'}`);

  if (info.rejected.length > 0) {
    console.log(`Rejected: ${info.rejected.join(', ')}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`SMTP test failed: ${message}`);
  process.exitCode = 1;
});