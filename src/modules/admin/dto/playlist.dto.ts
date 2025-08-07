import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Status } from "src/modules/playlist/enum/status.enum";

export class FindAllPlaylistDto extends PaginationDto {
    @ApiPropertyOptional({ enum: Status })
    @IsOptional()
    status: Status;
}
