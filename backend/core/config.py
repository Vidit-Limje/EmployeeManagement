# app/core/config.py

import os

POSTGRES_URI = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres.nnenchirytbpnrcuxmbi:Pratibha2004@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
)
