import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: "" })
    @IsString()
    @Length(3, 30)
    name: string;

    @ApiProperty({ example: "" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: "" })
    @IsNotEmpty()
    @Length(4, 20)
    @Matches(/^[a-z0-9_]+$/, {
        message: "نام کاربری فقط می‌تواند شامل حروف کوچک انگلیسی، عدد و آندرلاین (_) باشد.",
    })
    username: string;

    @ApiProperty({ example: "" })
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/, {
        message: "رمز عبور باید شامل حداقل یک حرف کوچک، یک حرف بزرگ، یک عدد و یک کاراکتر خاص باشد.",
    })
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: "" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: "" })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/, {
        message: "رمز عبور باید شامل حداقل یک حرف کوچک، یک حرف بزرگ، یک عدد و یک کاراکتر خاص باشد.",
    })
    password: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: "" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: "" })
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/, {
        message: "رمز عبور باید شامل حداقل یک حرف کوچک، یک حرف بزرگ، یک عدد و یک کاراکتر خاص باشد.",
    })
    password: string;
}
