import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailersService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendEmailRegister(email: string, token: string) {
    try {
      const mailerOptions: ISendMailOptions = {
        to: email,
        from: 'noreply@nestjs.com',
        subject: 'Verify Your Email - Do Something App',
        template: 'verify',
        context: {
          email: email,
          token: token,
          client_url: this.configService.get<string>(
            'CORS_ORIGIN',
            'localhost:3000',
          ),
        },
      };
      await this.mailerService.sendMail(mailerOptions);
    } catch (error) {
      throw new Error(`Failed to send verification email: ${error}`);
    }
  }
}
