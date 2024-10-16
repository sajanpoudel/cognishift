/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_UNDETECTABLE_AI_API_KEY: process.env.NEXT_PUBLIC_UNDETECTABLE_AI_API_KEY,
    GPTZERO_API_KEY: process.env.GPTZERO_API_KEY,
  },
};

export default nextConfig;
