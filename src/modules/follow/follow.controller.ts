import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { FollowService } from "./follow.service";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller("follow")
@Auth()
export class FollowController {
    constructor(private readonly followService: FollowService) {}

    @Get("/:userId/followers/count")
    @ApiOperation({ summary: "Get the number of followers for a user" })
    getFollowersCount(@Param("userId", ParseIntPipe) userId: string) {
        return this.followService.getFollowersCount(+userId);
    }

    @Get("/:userId/followings/count")
    @ApiOperation({ summary: "Get the number of followings for a user" })
    getFollowingsCount(@Param("userId", ParseIntPipe) userId: string) {
        return this.followService.getFollowingsCount(+userId);
    }

    @Get("/:userId/followers")
    @ApiOperation({ summary: "Get paginated list of followers for a user" })
    @Pagination()
    getFollowers(
        @Param("userId", ParseIntPipe) userId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.followService.getFollowers(+userId, paginationDto);
    }

    @Get("/:userId/followings")
    @ApiOperation({ summary: "Get paginated list of users followed by the user" })
    @Pagination()
    getFollowings(
        @Param("userId", ParseIntPipe) userId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.followService.getFollowings(+userId, paginationDto);
    }

    @Get("/:userId")
    @ApiOperation({ summary: "Follow or unfollow a user by ID" })
    toggleFollow(@Param("userId", ParseIntPipe) userId: string) {
        return this.followService.toggleFollow(+userId);
    }
}
