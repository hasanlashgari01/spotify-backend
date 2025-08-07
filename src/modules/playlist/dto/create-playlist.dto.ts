import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePlaylistDto {
    @ApiProperty({ example: "" })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiPropertyOptional({ type: "string", format: "binary" })
    @IsOptional()
    cover?: Express.Multer.File;

    @ApiPropertyOptional({ example: "" })
    @IsOptional()
    @IsString()
    description: string;
}
