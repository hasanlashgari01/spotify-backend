import { Controller, Get, Param, Query } from "@nestjs/common";
import { LikeService } from "./like.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller("like")
@Auth()
export class LikeController {
    constructor(private readonly likeService: LikeService) {}

    @Get("/my")
    @ApiOperation({ summary: "Get paginated list of songs liked by current user" })
    @Pagination()
    myLikes(@Query() paginationDto: PaginationDto) {
        return this.likeService.myLikes(paginationDto);
    }

    @Get(":songId")
    @ApiOperation({ summary: "Toggle like/unlike on a song by ID" })
    findOne(@Param("songId") songId: string) {
        return this.likeService.likeToggle(+songId);
    }
}
