module.exports = {
  apps: [{
    name: 'payload-cms',
    script: 'pnpm',
    args: 'dev',
    cwd: '/opt/payload-app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    log_file: '/opt/payload-app/logs/combined.log',
    out_file: '/opt/payload-app/logs/out.log',
    error_file: '/opt/payload-app/logs/error.log',
    merge_logs: true,
    time: true
  }]
}