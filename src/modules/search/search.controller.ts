import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { SearchQuery } from "./decorators/search.decorator";
import { SearchDto } from "./dto/search.dto";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get("/")
    @ApiOperation({
        summary: "Search by (all | songs | users | artists | playlists)",
    })
    @SearchQuery()
    search(@Query() searchDto: SearchDto) {
        return this.searchService.search(searchDto);
    }
}
