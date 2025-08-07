import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Gender } from "../enum/user.enum";

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: "" })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({ example: "" })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({ type: "string", format: "binary" })
    @IsOptional()
    avatar?: Express.Multer.File;

    @ApiPropertyOptional({ enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;
}
