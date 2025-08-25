module.exports = {
  apps: [{
    name: 'library-backend',
    script: 'src/index.ts',
    interpreter: 'tsx',
    watch: ['src'],
    watch_delay: 1000,
    ignore_watch: ['node_modules', 'uploads', '*.db'],
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};