import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestUserDto } from '../auth/dtos/request-user.dto';
import { FirebaseAuthGuard } from '../auth/guards/auth.guard';
import {
  FinancialDTO,
  UserDTO,
} from '../shared-definitions/types-dto-constants';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async fetchUsers(@Req() { user }: RequestUserDto): Promise<any> {
    try {
      return await this.userService.fetchUsers(user);
    } catch (error) {
      return { data: [{ status: 'error', error: error }] };
    }
  }

  @Get('/id/:id')
  async fetchById(
    @Req() { user }: RequestUserDto,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      return await this.userService.fetchUserById(user, id);
    } catch (error) {
      return { data: [{ status: 'error', error: error }] };
    }
  }

  @Get('/email/:email')
  async fetchByEmail(
    @Req() { user }: RequestUserDto,
    @Param('email') email: string,
  ): Promise<any> {
    try {
      return await this.userService.fetchUserByEmail(user, email);
    } catch (error) {
      return { data: [{ status: 'error', error: error }] };
    }
  }

  @Get('/data')
  @UseGuards(FirebaseAuthGuard)
  async createFinancialData(@Req() { user }: RequestUserDto): Promise<any> {
    try {
      return await this.userService.fetchFinancialData(user);
    } catch (error) {
      return { data: [{ status: 'error', error: error }] };
    }
  }

  @Post('/data')
  @UseGuards(FirebaseAuthGuard)
  async fetchFinancialData(
    @Req() { user }: RequestUserDto,
    @Body() body: FinancialDTO,
  ): Promise<any> {
    try {
      return await this.userService.createFinancialData(user, body);
    } catch (error) {
      return { data: [{ status: 'error', error: error }] };
    }
  }
}
