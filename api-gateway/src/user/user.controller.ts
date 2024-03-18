import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FirebaseAuthGuard } from '../auth/guards/auth.guard';
import {
  FinancialDTO,
  RequestUserDTO,
  UserResponseDTO,
} from '../shared-definitions/types-dto-constants';
import { CreateFinancialDataDTO } from './dtos/create-financial-data-dto';
import { FetchFinancialDataDTO } from './dtos/fetch-financial-data-dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async fetchUsers(): Promise<UserResponseDTO> {
    return await this.userService.fetchUsers();
  }

  @Get('/id/:id')
  async fetchById(@Param('id') id: string): Promise<UserResponseDTO> {
    return await this.userService.fetchUserById(id);
  }

  @Get('/email/:email')
  async fetchByEmail(@Param('email') email: string): Promise<UserResponseDTO> {
    return await this.userService.fetchUserByEmail(email);
  }

  @Get('/data')
  @UseGuards(FirebaseAuthGuard)
  async fetchFinancialData(
    @Req() { user }: RequestUserDTO,
  ): Promise<FetchFinancialDataDTO> {
    return await this.userService.fetchFinancialData(user);
  }

  @Post('/data')
  @UseGuards(FirebaseAuthGuard)
  async createFinancialData(
    @Req() { user }: RequestUserDTO,
    @Body() body: FinancialDTO,
  ): Promise<CreateFinancialDataDTO> {
    return await this.userService.createFinancialData(user, body);
  }
}
