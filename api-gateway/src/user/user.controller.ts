import { Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestUserDto } from '../auth/dtos/request-user.dto';
import { FirebaseAuthGuard } from '../auth/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async create(@Req() { user }: RequestUserDto): Promise<UserCreatePayload> {
    try {
      return await this.userService.createUser(user);
    } catch (error) {
      return { data: { status: 'error', error: error } };
    }
  }

  @Post(':id')
  @UseGuards(FirebaseAuthGuard)
  async fetchById(
    @Req() { user }: RequestUserDto,
    id: string,
  ): Promise<UserFetchPayload> {
    try {
      return await this.userService.fetchUserById(user, id);
    } catch (error) {
      return { data: [{ status: 'error', error: error }] };
    }
  }

  @Post(':email')
  @UseGuards(FirebaseAuthGuard)
  async fetchByEmail(
    @Req() { user }: RequestUserDto,
    email: string,
  ): Promise<UserFetchPayload> {
    try {
      return await this.userService.fetchUserByEmail(user, email);
    } catch (error) {
      return { data: [{ status: 'error', error: error }] };
    }
  }

  @Post('/data')
  @UseGuards(FirebaseAuthGuard)
  async createFinancialData(
    @Req() { user }: RequestUserDto,
    email: string,
  ): Promise<any> {
    try {
      // return await this.userService.fetchUserByEmail(user, email);
    } catch (error) {
      // return { data: [{ status: 'error', error: error }] };
    }
  }

  @Put('/data')
  @UseGuards(FirebaseAuthGuard)
  async updateFinancialData(
    @Req() { user }: RequestUserDto,
    email: string,
  ): Promise<any> {
    try {
      // return await this.userService.fetchUserByEmail(user, email);
    } catch (error) {
      // return { data: [{ status: 'error', error: error }] };
    }
  }
}

export type UserCreatePayload = {
  data: UserCreateResponseDto;
};

export type UserFetchPayload = {
  data: UserFetchResponseDto[];
};

export type UserCreateResponseDto = {
  status: string;
  error?: Error;
};

export type UserFetchResponseDto = {
  status: string;
  fetchedUser?: any;
  error?: Error;
};
