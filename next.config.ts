// next.config.ts
const isDev = process.env.NODE_ENV === 'development'

const ContentSecurityPolicy = isDev
  ? `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    connect-src 'self' http://localhost:8080;
    object-src 'none';
  `
  : `
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    connect-src 'self';
    object-src 'none';
  `
