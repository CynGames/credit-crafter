import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from './db/db-connection';
import { UserDTO } from './dto/user-dto';
import { CreateUserDTO } from './dto/create-user-dto';

@Injectable()
export class UsersRepository {
  async getUsers(): Promise<UserDTO[]> {
    const queryText =
      'select \
         u.user_id\
        , u.first_name\
        , u.last_name\
        , u.email\
        , u.address1\
        , u.phone_number\
        , u.created_at\
        , u.updated_at\
        , f.credit_score\
        , f.income\
        , f.expenses\
        from users u\
        inner join financial_data f \
        on u.financial_data_id = f.financial_data_id';

    try {
      const result = await pool.query(queryText);
      const users: UserDTO[] = result.rows.map(
        (row) =>
          new UserDTO(
            row.user_id,
            row.first_name,
            row.last_name,
            row.address1,
            row.email,
            row.phone_number,
            row.created_at,
            row.updated_at,
            row.credit,
            row.income,
            row.expenses,
          ),
      );
      return users;
    } catch (error) {
      throw new Error('error getting users');
    }
  }

  async create(user: CreateUserDTO): Promise<string> {
    const queryText =
      'insert into users(first_name, lastName, hashed_pass,\
        email, address1, phone_number) values ($1, $2, $3, $4, $5, $6) returning user_id';
    const values = [
      user.firstName,
      user.lastName,
      user.email,
      user.address,
      user.phoneNumber,
    ];
    try {
      const result = await pool.query(queryText, values);
      return result.rows[0].user_id;
    } catch (error) {
      throw new Error(`error creating user: ${error.message}`);
    }
  }
  async getById(user_id: string): Promise<UserDTO> {
    const queryText =
      'select u.first_name, u.last_name, u.email, u.address1, u.phone_number, u.created_at, u.updated_at, f.credit_score, f.income, f.expenses\
    from users u \
    inner join financial_data f on u.financial_data_id = f.financial_data_id where user_id = $1';
    try {
      const result = await pool.query(queryText, [user_id]);
      if (result.rows === null) {
        throw new NotFoundException('no user with that id');
      }
      const row = result.rows[0];
      const user = new UserDTO(
        user_id,
        row.first_name,
        row.last_name,
        row.address1,
        row.email,
        row.phone_number,
        row.created_at,
        row.updated_at,
        row.credit_score,
        row.income,
        row.expenses,
      );

      return user;
    } catch (error) {
      throw new Error(`Error getting user: ${error.message}`);
    }
  }
  async getByEmail(email: string) {
    const queryText =
      'select u.user_id, u.first_name, u.last_name, u.email, u.address1, u.phone_number, u.created_at, u.updated_at, f.credit_score, f.income, f.expenses\
    from users u \
    inner join financial_data f on u.financial_data_id = f.financial_data_id where email = $1';
    try {
      const result = await pool.query(queryText, [email]);
      if (result.rows === null) {
        throw new NotFoundException('no user with that email');
      }
      const row = result.rows[0];
      const user = new UserDTO(
        row.user_id,
        row.first_name,
        row.last_name,
        row.address1,
        row.email,
        row.phone_number,
        row.created_at,
        row.updated_at,
        row.credit_score,
        row.income,
        row.expenses,
      );

      return user;
    } catch (error) {
      throw new Error(`Error getting user: ${error.message}`);
    }
  }
}
