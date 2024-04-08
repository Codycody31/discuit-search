#!/bin/bash

set -Eeo pipefail

# Start the backend API in the background
cd /usr/local/server/
node ./server.js &

# Give it a few seconds to fully start (you can adjust this delay as needed)
sleep 5

# Start the httpd server in the foreground (so the container doesn't exit)
# httpd -D FOREGROUND

exec "$@"