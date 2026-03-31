# uLern-Polish — RunPod Docker Deployment Guide
# =============================================

# 1. Build the Docker image locally (optional — RunPod can build from a Git repo)
#    docker build -t ulern-polish-backend https://github.com/YOUR_USERNAME/uLern-Polish-Web.git#:backend
#    Or build locally and push to a registry:
#    docker build -t ghcr.io/YOUR_USERNAME/ulern-polish-backend:latest .
#    docker push ghcr.io/YOUR_USERNAME/ulern-polish-backend:latest

# 2. Deploy to RunPod
#    - Go to https://runpod.io → Deploy → Docker → Container
#    - Image: ghcr.io/YOUR_USERNAME/ulern-polish-backend:latest
#      (or your preferred registry image)
#    - Container name: ulern-polish-backend
#    - GPU: None (CPU is sufficient for Express + OpenRouter calls)
#    - vCPU: 2
#    - Memory: 2 GB
#    - Port: 5000 (TCP, public)
#    - Env vars: add all vars from .env.production (see below)
#    - Health check: GET /api/health
#    - Min instances: 1
#    - Max instances: 3 (for auto-scaling on load)

# 3. After deploy, note the RunPod public URL:
#    e.g., https://your-endpoint-abc123-00-xxxxx-xxxxxxxxxxxxx.cloud.container.cloud:5000
#    → This becomes RUNPOD_EXPRESS_URL in Vercel env vars

# 4. Vercel dashboard → your project → Settings → Environment Variables:
#    NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
#    RUNPOD_EXPRESS_URL=https://your-endpoint-abc123-00-xxxxx-xxxxxxxxxxxxx.cloud.container.cloud:5000
#    (Note: vercel.json rewrites handle the proxy — you just need the domain here)

# 5. Update vercel.json with your actual RunPod URL before deploying.
