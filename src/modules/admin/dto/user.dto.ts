import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Gender, Role, Status } from "src/modules/users/enum/user.enum";

export class FindAllUsersDto extends PaginationDto {
    @ApiPropertyOptional({ enum: Role })
    @IsOptional()
    role: Role;

    @ApiPropertyOptional({ enum: Status })
    @IsOptional()
    status: Status;

    @ApiPropertyOptional({ enum: Gender })
    @IsOptional()
    gender: Gender;
}
