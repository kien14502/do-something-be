import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import jwtConfig, { jwtRefreshConfig } from './config/jwt.config';
import appConfig from './config/app.config';
import dataSource from './config/database.config';
import { DatabaseModule } from './common/services/database/database.module';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/mailer.config';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { WorkspaceMemberModule } from './modules/workspace-member/workspace-member.module';
import { ProjectModule } from './modules/project/project.module';
import { ProjectMemberModule } from './modules/project-member/project-member.module';
import { SprintModule } from './modules/sprint/sprint.module';
import { IssueModule } from './modules/issue/issue.module';
import { ProjectStatusModule } from './modules/project-status/project-status.module';
import { SprintIssueModule } from './modules/sprint-issue/sprint-issue.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, jwtRefreshConfig, appConfig, dataSource],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      cache: true,
    }),
    MailerModule.forRootAsync({
      useFactory: mailerConfig,
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    WorkspaceModule,
    WorkspaceMemberModule,
    ProjectModule,
    ProjectMemberModule,
    SprintModule,
    IssueModule,
    ProjectStatusModule,
    SprintIssueModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
