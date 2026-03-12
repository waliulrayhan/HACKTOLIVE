#!/bin/sh
# Write valid JSON and test email sending
cat > /tmp/test_email.json << 'JSONEOF'
{"email":"waliulrayhan@gmail.com"}
JSONEOF

echo "Sending test email via forgot-password endpoint..."
curl -s -X POST http://localhost:4000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d @/tmp/test_email.json

echo ""
echo "Checking backend logs for send result..."
sleep 3
docker logs hacktolive-backend --since=10s 2>&1
