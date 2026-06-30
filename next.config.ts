import type { NextConfig } from "next";
import { execute } from './process.env.config.js';

execute();


const nextConfig: NextConfig = {
  /* config options here */
  env: {
    COOKIE_PREFIX: process.env.COOKIE_PREFIX,
    COOKIES: process.env.COOKIES,
    BASE_URL: process.env.BASE_URL,
    EMPTOR: process.env.EMPTOR,
    BACO: process.env.BACO,
    BACO_SAVINGS: process.env.BACO_SAVINGS,
    BACO_BENEFITS: process.env.BACO_BENEFITS,
    SUSCRIPTION_NEWSLETTER:  process.env.SUSCRIPTION_NEWSLETTER,
    CMS: process.env.CMS,
    SAC: process.env.SAC,
    SALESFORCE: process.env.SALESFORCE,
    ELASTIC_DATA: process.env.ELASTIC_DATA,
    ELASTIC_INDEX: process.env.ELASTIC_INDEX,
    MAIL_VALUES: process.env.MAIL_VALUES,
    GOOGLE: process.env.GOOGLE,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "movilidadapkpruebas.ceet.co",
      },
      {
        protocol: "https",
        hostname: "clubvivamos.ceet.co",
      },
      {
        protocol: "https",
        hostname: "stg.clubvivamos.com",
      },
      {
        protocol: "https",
        hostname: "www.clubvivamos.com",
      },
      {
        protocol: "https",
        hostname: "pre.eltiempo.com",
      },
    ],
  },
};

export default nextConfig;
