#!/bin/bash
# BTEC D.P8 — Manual Deployment Script
# Deploy updated images to EC2 with zero downtime
# Usage: ./scripts/deploy.sh [IMAGE_TAG]

set -e

EC2_HOST="${EC2_HOST:?Set EC2_HOST environment variable}"
EC2_USER="${EC2_USER:-ubuntu}"
SSH_KEY="${SSH_KEY:-~/.ssh/crm-keypair.pem}"
IMAGE_TAG="${1:-latest}"

echo "🚀 Deploying CRM Cloud — Tag: $IMAGE_TAG"
echo "   Host: $EC2_HOST"

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" << REMOTE
set -e
cd /opt/crm-cloud

# Ensure repository is present and up-to-date on the remote host.
# Prefer SSH clone/pull to avoid interactive HTTPS password prompts. If SSH access
# is not available, fall back to HTTPS clone using the provided GITHUB_OWNER.
GITHUB_OWNER="${GITHUB_OWNER:-fuzailovvv}"
if [ -d /opt/crm-cloud/.git ]; then
	echo "Repository exists — fetching latest changes"
	cd /opt/crm-cloud
	git fetch --all --prune
	git reset --hard origin/main || true
else
	echo "Repository not found — attempting SSH clone"
	if git ls-remote git@github.com:$GITHUB_OWNER/CloudCRM.git >/dev/null 2>&1; then
		git clone --depth 1 git@github.com:$GITHUB_OWNER/CloudCRM.git /opt/crm-cloud
	else
		echo "SSH clone failed or not available — falling back to HTTPS clone"
		git clone --depth 1 https://github.com/$GITHUB_OWNER/CloudCRM.git /opt/crm-cloud
	fi
fi

# Optional: login to private registry if credentials supplied to avoid interactive prompts
if [ -n "$REGISTRY" ] && [ -n "$REGISTRY_USER" ] && [ -n "$REGISTRY_TOKEN" ]; then
	echo "Logging in to registry $REGISTRY"
	echo "$REGISTRY_TOKEN" | docker login $REGISTRY -u "$REGISTRY_USER" --password-stdin
fi

# Pull new images
IMAGE_TAG="$IMAGE_TAG" docker compose -f docker-compose.prod.yml pull

# Run DB seed (idempotent) to ensure demo users exist
echo "Running DB seed to populate demo data (idempotent)..."
IMAGE_TAG="$IMAGE_TAG" docker compose -f docker-compose.prod.yml run --rm seed || echo "Seed run failed or skipped"

# Rolling restart: backend first
docker compose -f docker-compose.prod.yml up -d --no-deps backend
sleep 15

# Verify health
curl -sf http://localhost/api/health | python3 -m json.tool

# Update frontend
docker compose -f docker-compose.prod.yml up -d --no-deps frontend

# Reload nginx config without downtime
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Cleanup
docker image prune -f

echo "✅ Deployment complete at \$(date)"
REMOTE

echo "✅ Deploy finished. App running at http://$EC2_HOST"
