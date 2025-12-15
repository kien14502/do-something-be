import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret:
      process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN
        ? parseInt(process.env.JWT_EXPIRES_IN)
        : '7d',
      issuer: process.env.JWT_ISSUER || 'do-something-api',
      audience: process.env.JWT_AUDIENCE || 'do-something-client',
    },
  }),
);

// JWT Refresh Token Config
export const jwtRefreshConfig = registerAs(
  'jwtRefresh',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    signOptions: {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
        : '30d',
      issuer: process.env.JWT_ISSUER || 'do-something-api',
      audience: process.env.JWT_AUDIENCE || 'do-something-client',
    },
  }),
);
