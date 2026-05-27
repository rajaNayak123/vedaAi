/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_PUBLIC_ vars are automatically available client-side from .env.local
  // No special config needed — just ensure .env.local has:
  // NEXT_PUBLIC_API_URL=http://localhost:5000
  // NEXT_PUBLIC_WS_URL=ws://localhost:5000/ws
};

module.exports = nextConfig;
