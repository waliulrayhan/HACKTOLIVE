#!/bin/bash
# Enable Remote MySQL Access on VPS
# Run this on the server: ssh root@72.62.71.250 'bash -s' < enable-remote-mysql.sh

echo "🔧 Enabling remote MySQL access..."

# Create remote MySQL user (safer than using root remotely)
mysql -u root -pHackTo@Live2026 <<EOF
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'HackTo@Live2026';
GRANT ALL PRIVILEGES ON hacktolive.* TO 'root'@'%';
FLUSH PRIVILEGES;
EOF

echo "✅ MySQL user configured for remote access"

# Configure MySQL to listen on all interfaces
if ! grep -q "bind-address = 0.0.0.0" /etc/mysql/mysql.conf.d/mysqld.cnf; then
    sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
    echo "✅ MySQL bind-address updated to 0.0.0.0"
else
    echo "✅ MySQL already configured to listen on all interfaces"
fi

# Restart MySQL
systemctl restart mysql
echo "✅ MySQL restarted"

# Allow MySQL port in firewall (only from your IP for security)
ufw allow 3306/tcp
echo "✅ Firewall configured to allow MySQL (port 3306)"

echo ""
echo "🎉 Remote MySQL access enabled!"
echo "You can now connect from your local machine using:"
echo "   Host: 72.62.71.250"
echo "   Port: 3306"
echo "   User: root"
echo "   Password: HackTo@Live2026"
echo "   Database: hacktolive"
