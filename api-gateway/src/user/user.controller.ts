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
import { FirebaseAuthGuard } from '../decorators/guards/auth.guard';
import {
  FinancialDTO,
  RequestUserDTO,
} from '../shared-definitions/types-dto-constants';
import { CreateFinancialDataDTO } from './dtos/create-financial-data-dto';
import { FetchFinancialDataDTO } from './dtos/fetch-financial-data-dto';
import {
  AppApiCreatedResponse,
  AppApiOkResponse,
} from '../decorators/app-api.decorators';
import { UserResponseDTO, UsersResponseDTO } from './dtos/fetch-users.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User Controller')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AppApiOkResponse({ type: UsersResponseDTO })
  @Get('/')
  async fetchUsers(): Promise<UsersResponseDTO> {
    return await this.userService.fetchUsers();
  }

  @AppApiOkResponse({ type: UserResponseDTO })
  @Get('/id/:id')
  async fetchById(@Param('id') id: string): Promise<UserResponseDTO> {
    return await this.userService.fetchUserById(id);
  }

  @AppApiOkResponse({ type: UserResponseDTO })
  @Get('/email/:email')
  async fetchByEmail(@Param('email') email: string): Promise<UserResponseDTO> {
    return await this.userService.fetchUserByEmail(email);
  }

  @AppApiOkResponse({ type: FetchFinancialDataDTO })
  @Get('/data')
  @UseGuards(FirebaseAuthGuard)
  async fetchFinancialData(
    @Req() { user }: RequestUserDTO,
  ): Promise<FetchFinancialDataDTO> {
    return await this.userService.fetchFinancialData(user);
  }

  @AppApiCreatedResponse({ type: CreateFinancialDataDTO })
  @Post('/data')
  @UseGuards(FirebaseAuthGuard)
  async createFinancialData(
    @Req() { user }: RequestUserDTO,
    @Body() body: FinancialDTO,
  ): Promise<CreateFinancialDataDTO> {
    return await this.userService.createFinancialData(user, body);
  }
}
