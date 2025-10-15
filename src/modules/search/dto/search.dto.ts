import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class SearchDto extends PaginationDto {
    @ApiProperty()
    @IsOptional()
    q: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsIn(["artist", "song", "playlist", "user"])
    filter?: "artist" | "song" | "playlist" | "user";
}
