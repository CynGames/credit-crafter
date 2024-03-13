import { IsEmail, IsString, IsOptional, IsPhoneNumber } from 'class-validator'

export class CreateUserDTO {
    @IsString()
    firstName:string;

    @IsString()
    lastName: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    address: string;

    @IsEmail()
    email: string


}