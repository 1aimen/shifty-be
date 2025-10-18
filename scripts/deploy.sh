#!/bin/bash
#
#
#
#
#
#
#

set -e

IMAGE_NAME="yourusername/yourapp"
APP_NAME="app"
PORT=3000
NEW_PORT=$((PORT + 1))

echo "Pulling latest image..."
docker pull $IMAGE_NAME:latest

echo "Starting new container on port $NEW_PORT..."
docker run -d \
  --name ${APP_NAME}_new \
  -p $NEW_PORT:3000 \
  $IMAGE_NAME:latest

# Optional: health check (adjust URL if needed)
echo "Waiting for new container to be ready..."
for i in {1..20}; do
  if curl -fs http://localhost:$NEW_PORT >/dev/null 2>&1; then
    echo "New container is healthy!"
    break
  fi
  echo "Waiting ($i/20)..."
  sleep 3
done

# Switch traffic
echo "Switching containers..."
docker stop $APP_NAME || true
docker rm $APP_NAME || true
docker rename ${APP_NAME}_new $APP_NAME

echo "Cleaning up..."
docker image prune -f

echo "deployment complete!"
