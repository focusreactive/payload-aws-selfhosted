module.exports = {
  apps: [{
    name: 'payload-cms',
    script: './server.js',
    cwd: '/opt/payload-app/.next/standalone',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    log_file: '/opt/payload-app/logs/combined.log',
    out_file: '/opt/payload-app/logs/out.log',
    error_file: '/opt/payload-app/logs/error.log',
    merge_logs: true,
    time: true
  }]
}