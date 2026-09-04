const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const apiOrigin = (() => {
  try {
    return new URL(apiUrl).origin.replace(/^https?:\/\//, "").split(":")[0];
  } catch {
    return "localhost";
  }
})();

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: apiOrigin },
      { protocol: "https", hostname: apiOrigin },
    ],
  },
};

module.exports = nextConfig;
