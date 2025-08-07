import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdatePlaylistDto {
    @ApiPropertyOptional({ example: "" })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ type: "string", format: "binary" })
    @IsOptional()
    cover?: Express.Multer.File;

    @ApiPropertyOptional({ example: "" })
    @IsOptional()
    @IsString()
    description?: string;
}
