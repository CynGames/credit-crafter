import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../db/db-connection';
import { UserDTO } from './dtos/user-dto';
import { CreateUserDTO } from './dtos/create-user-dto';
import { FinancialDataDTO } from './dtos/financial-data-dto';
import { CreateFinancialDataDTO } from './dtos/create-financial-data-dto';

@Injectable()
export class UserRepository {
  async getUsers(): Promise<UserDTO[]> {
    const queryText = `
        SELECT u.user_id,
               u.first_name,
               u.last_name,
               u.email,
               u.created_at,
               u.updated_at,
               f.credit_score,
               f.income,
               f.expenses
        FROM users u
                 LEFT JOIN financial_data f ON u.financial_data_id = f.financial_data_id;`;

    try {
      const result = await pool.query(queryText);

      return result.rows.map(
        (row) =>
          new UserDTO(
            row.user_id,
            row.first_name,
            row.last_name,
            row.email,
            new Date(row.created_at),
            new Date(row.updated_at),
            {
              creditScore: row.credit_score,
              income: row.income,
              expenses: row.expenses,
            },
          ),
      );
    } catch (error) {
      throw new Error('Error getting users: ' + error.message);
    }
  }

  async create(user: CreateUserDTO): Promise<string> {
    const queryText = `
        INSERT INTO users(user_id, first_name, last_name, email)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id`;

    const values = [user.user_id, user.first_name, user.last_name, user.email];

    try {
      const result = await pool.query(queryText, values);

      return result.rows[0].user_id;
    } catch (error) {
      throw new Error(`error creating user: ${error.message}`);
    }
  }

  async getById(user_id: string): Promise<UserDTO> {
    const queryText = `
        SELECT user_id,
               first_name,
               last_name,
               email,
               created_at,
               updated_at
        FROM users
        WHERE user_id = $1`;

    try {
      const result = await pool.query(queryText, [user_id]);

      if (result.rows.length === 0) {
        throw new NotFoundException('No user with that ID');
      }

      const row = result.rows[0];

      return new UserDTO(
        row.user_id,
        row.first_name,
        row.last_name,
        row.email,
        new Date(row.createdAt),
        new Date(row.updatedAt),
      );
    } catch (error) {
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  }

  async getByEmail(email: string): Promise<UserDTO> {
    const queryText = `
        SELECT user_id,
               first_name,
               last_name,
               email,
               created_at,
               updated_at
        FROM users
        WHERE email = $1`;

    try {
      const result = await pool.query(queryText, [email]);

      if (result.rows.length === 0) {
        throw new NotFoundException('No user with that email');
      }

      const row = result.rows[0];

      return new UserDTO(
        row.user_id,
        row.first_name,
        row.last_name,
        row.email,
        new Date(row.createdAt),
        new Date(row.updatedAt),
      );
    } catch (error) {
      throw new Error(`Error getting user by email: ${error.message}`);
    }
  }

  async createFinancialData(
    financialData: CreateFinancialDataDTO,
  ): Promise<string> {
    const queryText = `
        INSERT INTO financial_data (financial_data_id, credit_score, income, expenses)
        VALUES ($1, $2, $3, $4)
        RETURNING financial_data_id`;

    const values = [
      financialData.userId,
      financialData.creditScore,
      financialData.income,
      financialData.expenses,
    ];

    try {
      const result = await pool.query(queryText, values);
      return result.rows[0].financial_data_id;
    } catch (error) {
      throw new Error(`Error creating financial data: ${error.message}`);
    }
  }

  async getFinancialDataById(userId: string): Promise<FinancialDataDTO> {
    const queryText = `
        SELECT financial_data_id,
               credit_score,
               income,
               expenses,
               created_at,
               updated_at
        FROM financial_data
        WHERE financial_data_id = $1`;

    try {
      const result = await pool.query(queryText, [userId]);

      if (result.rows.length === 0) {
        throw new NotFoundException('No financial data found for user ID');
      }

      const row = result.rows[0];

      return new FinancialDataDTO(
        row.financial_data_id,
        row.credit_score,
        row.income,
        row.expenses,
        new Date(row.createdAt),
        new Date(row.updatedAt),
      );
    } catch (error) {
      throw new Error(
        `Error getting financial data by user ID: ${error.message}`,
      );
    }
  }
}
