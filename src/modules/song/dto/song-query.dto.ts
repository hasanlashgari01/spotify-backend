import { IsIn, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class SongsQueryDto extends PaginationDto {
    @IsOptional()
    @IsIn(["title", "artist", "createdAt", "duration"])
    sortBy?: "title" | "artist" | "createdAt" | "duration";

    @IsOptional()
    @IsIn(["ASC", "DESC"])
    order?: "ASC" | "DESC";
}
