import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGenreDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiPropertyOptional({ type: "string", format: "binary" })
    @IsOptional()
    cover?: Express.Multer.File;
}
