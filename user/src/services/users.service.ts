import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import { UsersRepository } from 'src/users.repository';
@Injectable()
export class UsersService {
    constructor(private repo: UsersRepository){}

    async create(newUser: CreateUserDTO): Promise<String>{
        try{
            const userId = await this.repo.create(newUser);
            return userId
        }catch(error){
            throw new Error(error.message);
        }
    }

    async findOne(id: string){
       try{
        const user = await this.repo.getById(id);
        return user;
       }catch(error){
        throw new Error(error.message);
       }
    }



}
