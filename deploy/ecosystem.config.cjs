// PM2 process config for the Facile backend (both environments).
// The backend reads its PORT and all secrets from the .env file in its own directory
// (config/index.js loads `.env` when NODE_ENV != "dev"). So each environment's .env
// lives beside its code; this file only names the process, cwd, and NODE_ENV.
//
// Usage on the server:
//   pm2 start deploy/ecosystem.config.cjs --only facile-api-prod
//   pm2 start deploy/ecosystem.config.cjs --only facile-api-staging
//   pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: "facile-api-prod",
      cwd: "/var/www/facile/facile-backend",
      script: "src/server.js",
      env: { NODE_ENV: "production" }, // -> loads .env in cwd (PORT=4000)
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
    },
    {
      name: "facile-api-staging",
      cwd: "/var/www/facile-staging/facile-backend",
      script: "src/server.js",
      env: { NODE_ENV: "production" }, // -> loads .env in cwd (PORT=4100)
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
    },
  ],
};
