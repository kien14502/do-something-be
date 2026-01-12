import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const mailerConfig = (configService: ConfigService) => {
  const host = configService.get<string>('EMAIL_HOST', 'smtp.gmail.com');
  const port = Number(configService.get('EMAIL_PORT', 465));
  const user = configService.get<string>('EMAIL_USER');
  const pass = configService.get<string>('EMAIL_PASSWORD');
  const env = configService.get<string>('NODE_ENV', 'development');

  if (!user || !pass) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASSWORD');
  }

  const secure = port === 465;

  if (!user || !pass) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS for SMTP transport');
  }

  const root = env === 'production' ? 'dist' : 'src';

  const templatesDir = join(
    process.cwd(),
    `${root}`,
    'common',
    'services',
    'mailers',
    'templates',
  );

  return {
    transport: {
      host,
      port,
      secure,
      auth: { user, pass },
    },
    defaults: {
      from: configService.get<string>('EMAIL_USER', user),
    },
    template: {
      dir: templatesDir,
      adapter: new HandlebarsAdapter(),
      options: { strict: true },
    },
  };
};
