import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailDto } from './dtos/email.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/email/:email')
  async findByEmail(@Query() { email }: EmailDto) {
    return await this.userService.findOneBy({ email });
  }
}
