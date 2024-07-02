module.exports = {
  apps: [
    {
      name: "heythere-backend",
      script: "./dist/index.js",
      env_production: {
        NODE_ENV: "PRODUCTION",
      },
      env_development: {
        NODE_ENV: "DEVELOPMENT",
      },
    },
  ],
};
