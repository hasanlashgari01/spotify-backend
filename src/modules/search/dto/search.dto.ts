import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";

export class SearchDto {
    @ApiProperty()
    @IsOptional()
    q: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsIn(["artist", "song", "playlist", "user"])
    filter?: "artist" | "song" | "playlist" | "user";

    @ApiPropertyOptional({ type: "integer" })
    @IsOptional()
    page: number;
}
