import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class SearchDto {
    @ApiPropertyOptional()
    @IsOptional()
    playlistId: string;

    @ApiPropertyOptional()
    @IsOptional()
    q: string;
}
