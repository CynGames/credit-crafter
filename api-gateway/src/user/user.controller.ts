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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async fetchUsers(): Promise<FetchUsersDTO> {
    return await this.userService.fetchUsers();
  }

  @Get('/id/:id')
  async fetchById(@Param('id') id: string): Promise<RequestDTO> {
    return await this.userService.fetchUserById(id);
  }

  @Get('/email/:email')
  async fetchByEmail(@Param('email') email: string): Promise<RequestDTO> {
    return await this.userService.fetchUserByEmail(email);
  }

  @Get('/data')
  @UseGuards(FirebaseAuthGuard)
  async fetchFinancialData(@Req() user: RequestUserDTO): Promise<any> {
    return await this.userService.fetchFinancialData(user);
  }

  @Post('/data')
  @UseGuards(FirebaseAuthGuard)
  async createFinancialData(
    @Req() user: RequestUserDTO,
    @Body() body: FinancialDTO,
  ): Promise<any> {
    return await this.userService.createFinancialData(user, body);
  }
}

export interface RequestDTO {
  data: any;
}

export type UserDTO = FetchUsersDTO | FetchUserDTO;

export type FinancialDTO = {
  income: number;
  expenses: number;
};

export type FetchFinancialDataDTO = {
  data: FinancialData;
};

export type CreateFinancialDataDTO = {
  data: {
    success: boolean;
    financialData: FinancialData;
  };
};

export class FetchUserDTO implements RequestDTO {
  data: UserPayload;
}

export class FetchUsersDTO implements RequestDTO {
  data: UserPayload[];
}

export type UserPayload = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  financialData?: FinancialData;
};

export type FinancialData = {
  creditScore?: number;
  income?: number;
  expenses?: number;
};

export type RequestUserDTO = {
  id: string;
  email: string;
};
