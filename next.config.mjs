/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    // GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    // NEXT_PUBLIC_UNDETECTABLE_AI_API_KEY: process.env.NEXT_PUBLIC_UNDETECTABLE_AI_API_KEY,
    // GPTZERO_API_KEY: process.env.GPTZERO_API_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    return config;
  },
};

export default nextConfig;
