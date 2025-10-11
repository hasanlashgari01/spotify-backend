import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { ArtistOnly, Auth } from "src/common/decorators/auth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { FormType } from "src/common/enum/form-type.enum";
import { SongStatus } from "src/common/enum/song.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { AudioValidation } from "src/common/utils/upload.utils";
import { SongFilterStatus } from "./decorators/query.decorator";
import { SortAndPaginationQuery } from "../../common/decorators/sort.decorator";
import { CreateSongDto } from "./dto/create-song.dto";
import { UpdateSongDto } from "./dto/update-song.dto";
import { SongsService } from "./song.service";
import { SongsQueryDto } from "./dto/song-query.dto";

@Controller("song")
export class SongsController {
    constructor(private readonly songsService: SongsService) {}

    @Post()
    @UseInterceptors(UploadFileS3("audio"))
    @ArtistOnly()
    @ApiConsumes(FormType.Multipart)
    @ApiOperation({ summary: "Upload a new song (artists only)" })
    create(
        @Body() createSongDto: CreateSongDto,
        @UploadedFile(AudioValidation) audio: Express.Multer.File,
    ) {
        return this.songsService.create(createSongDto, audio);
    }

    @Get("/")
    @ApiOperation({ summary: "Get all songs" })
    @Pagination()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.songsService.findAll(paginationDto);
    }

    @Get("/made-for-you")
    @Auth()
    @ApiOperation({ summary: "Get list of made for you (10)" })
    madeForYou() {
        return this.songsService.madeForYou();
    }

    @Get("/new-songs")
    @ApiOperation({ summary: "Get list of new songs (10)" })
    newSongs() {
        return this.songsService.newSongs();
    }

    @Get("/popular-songs")
    @ApiOperation({ summary: "Get list of popular songs (10)" })
    popularSongs() {
        return this.songsService.popularSongs();
    }

    @Get("/my")
    @ArtistOnly()
    @ApiOperation({ summary: "Get my songs filtered by status" })
    @SongFilterStatus()
    mySongs(@Query("status") status: SongStatus) {
        return this.songsService.mySongs(status);
    }

    @Get("/status/:id")
    @ArtistOnly()
    @ApiOperation({ summary: "Toggle active/inactive status of a song (artists only)" })
    toggleStatus(@Param("id") id: string) {
        return this.songsService.toggleStatus(+id);
    }

    @Get("/play/:id")
    @ApiOperation({ summary: "Increment song play count" })
    incrementPlaySong(@Param("id") id: string) {
        return this.songsService.incrementPlaySong(+id);
    }

    @Get("/genre/:id")
    @ApiOperation({ summary: "Get songs by genre" })
    @SortAndPaginationQuery()
    getSongsByGenreSlug(@Param("id") id: string, @Query() query: SongsQueryDto) {
        return this.songsService.getSongsByGenreSlug(+id, query, query.sortBy, query.order);
    }

    @Get(":id")
    @ApiOperation({ summary: "Get song details by ID" })
    findOne(@Param("id") id: string) {
        return this.songsService.findOneById(+id);
    }

    @Patch(":id")
    @ArtistOnly()
    @ApiConsumes(FormType.Multipart)
    @ApiOperation({ summary: "Update a song (artists only)" })
    @UseInterceptors(UploadFileS3("audio"))
    update(
        @Param("id") id: string,
        @Body() updateSongDto: UpdateSongDto,
        @UploadedFile(AudioValidation) audio: Express.Multer.File,
    ) {
        return this.songsService.update(+id, updateSongDto, audio);
    }

    @Delete(":id")
    @ArtistOnly()
    @ApiOperation({ summary: "Delete a song by ID (artists only)" })
    remove(@Param("id") id: string) {
        return this.songsService.remove(+id);
    }
}
