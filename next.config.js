await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
      },
    ],
  },
  webpack: (config) => {
    // eslint-disable-next-line
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    // eslint-disable-next-line
    return config;
  },
};

export default config;
