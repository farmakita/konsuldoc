#!/bin/bash
set -e

PROJECT_ID="your-gcp-project-id"
REGION="asia-southeast1"
IMAGE="gcr.io/$PROJECT_ID/konsuldoc-api"

echo "→ Building image..."
docker build -t "$IMAGE:latest" ./server

echo "→ Pushing to Container Registry..."
docker push "$IMAGE:latest"

echo "→ Deploying to Cloud Run..."
gcloud run services replace cloud-run.yaml \
  --region "$REGION" \
  --project "$PROJECT_ID"

echo "→ Making service public..."
gcloud run services add-iam-policy-binding konsuldoc-api \
  --region "$REGION" \
  --member="allUsers" \
  --role="roles/run.invoker"

echo ""
echo "Deployed. Service URL:"
gcloud run services describe konsuldoc-api \
  --region "$REGION" \
  --format="value(status.url)"
