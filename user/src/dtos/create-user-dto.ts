import { IsEmail, IsString, IsOptional, IsPhoneNumber } from 'class-validator'

export class createUserDTO {
    @IsString()
    firstName:string;

    @IsString()
    lastName: string;

    @IsString()
    password:string;

    @IsString()
    phoneNumber: string;

    @IsString()
    address: string;

    @IsEmail()
    email: string


}