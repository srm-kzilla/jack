module.exports = {
  apps: [
    {
      name: "Jack - The SRMKZILLA Discord Bot",
      script: "./build/src/api/app.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
