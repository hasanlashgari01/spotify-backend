import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { GenresService } from "./genres.service";

@Controller("genres")
export class GenresController {
    constructor(private readonly genresService: GenresService) {}

    @Get()
    @ApiOperation({ summary: "Get list of all genres" })
    findAll() {
        return this.genresService.findAll();
    }

    @Get(":slug")
    @ApiOperation({ summary: "Get genre details by slug" })
    findOne(@Param("slug") slug: string) {
        return this.genresService.findOneBySlug(slug);
    }
}
