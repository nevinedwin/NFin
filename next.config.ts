import type { NextConfig } from "next";
import withPWA from '@ducanh2912/next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  disable: isDev,
  workboxOptions: {
    disableDevLogs: true
  }
})

export default pwaConfig(nextConfig);
