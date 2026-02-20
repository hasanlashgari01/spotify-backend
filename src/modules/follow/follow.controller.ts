import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { Auth, OptionalAuth } from "src/common/decorators/auth.decorator";
import { FollowService } from "./follow.service";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller("follow")
export class FollowController {
    constructor(private readonly followService: FollowService) {}

    @Get("/:userId")
    @Auth()
    @ApiOperation({ summary: "Check if the current user is following the user" })
    checkFollow(@Param("userId", ParseIntPipe) userId: string) {
        return this.followService.checkFollow(+userId);
    }

    @Get("/:userId/followers/count")
    @OptionalAuth()
    @ApiOperation({ summary: "Get the number of followers for a user (optional auth)" })
    getFollowersCount(@Param("userId", ParseIntPipe) userId: string) {
        return this.followService.getFollowersCount(+userId);
    }

    @Get("/:userId/followings/count")
    @OptionalAuth()
    @ApiOperation({ summary: "Get the number of followings for a user (optional auth)" })
    getFollowingsCount(@Param("userId", ParseIntPipe) userId: string) {
        return this.followService.getFollowingsCount(+userId);
    }

    @Get("/:userId/followers")
    @Auth()
    @ApiOperation({ summary: "Get paginated list of followers for a user" })
    @Pagination()
    getFollowers(
        @Param("userId", ParseIntPipe) userId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.followService.getFollowers(+userId, paginationDto);
    }

    @Get("/:userId/followings")
    @Auth()
    @ApiOperation({ summary: "Get paginated list of users followed by the user" })
    @Pagination()
    getFollowings(
        @Param("userId", ParseIntPipe) userId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.followService.getFollowings(+userId, paginationDto);
    }

    @Get("/:userId")
    @Auth()
    @ApiOperation({ summary: "Follow or unfollow a user by ID" })
    toggleFollow(@Param("userId", ParseIntPipe) userId: string) {
        return this.followService.toggleFollow(+userId);
    }
}
