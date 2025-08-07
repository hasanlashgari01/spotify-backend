import { PartialType } from "@nestjs/swagger";
import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @Length(8, 16)
    password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
