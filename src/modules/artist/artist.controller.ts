import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { OptionalAuth } from "src/common/decorators/auth.decorator";
import { ArtistService } from "./artist.service";

@Controller("artist")
export class ArtistController {
    constructor(private readonly artistService: ArtistService) {}

    @Get("/profile/:username")
    @OptionalAuth()
    @ApiOperation({
        summary: "Get artist profile by username (optional auth)",
        description: "Returns a artist's profile by username.",
    })
    getProfile(@Param("username") username: string) {
        return this.artistService.getProfile(username);
    }

    @Get("/popular/:id")
    myPopularSongs(@Param("id") id: string) {
        return this.artistService.myPopularSongs(+id);
    }
}
