# ==============================================
# HACKTOLIVE - PM2 Ecosystem Configuration
# ==============================================
# Alternative to manual PM2 commands
# Usage: pm2 start ecosystem.config.js
# ==============================================

module.exports = {
  apps: [
    {
      name: 'hacktolive-backend',
      cwd: '/var/www/hacktolive/backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/var/log/pm2/hacktolive-backend-error.log',
      out_file: '/var/log/pm2/hacktolive-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    },
    {
      name: 'hacktolive-frontend',
      cwd: '/var/www/hacktolive/frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/hacktolive-frontend-error.log',
      out_file: '/var/log/pm2/hacktolive-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    }
  ]
};
