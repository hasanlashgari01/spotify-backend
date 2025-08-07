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
import { Pagination } from "src/common/decorators/pagination.decorator";
import { AdminService } from "./admin.service";
import { UserQuery } from "./decorators/user.decorator";
import { FindAllUsersDto } from "./dto/user.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AdminOnly } from "src/common/decorators/auth.decorator";
import { ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { FormType } from "src/common/enum/form-type.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { CreateGenreDto } from "../genres/dto/create-genre.dto";
import { OptionalImageValidation } from "src/common/utils/upload.utils";
import { UpdateGenreDto } from "../genres/dto/update-genre.dto";
import { PlaylistQuery } from "./decorators/playlist.decorator";
import { FindAllPlaylistDto } from "./dto/playlist.dto";
import { SongStatus } from "src/common/enum/song.enum";
import { SongFilterStatus } from "../song/decorators/query.decorator";

@Controller("admin")
@AdminOnly()
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("/user")
    @ApiOperation({ summary: "Get all users filtered by status, role, gender" })
    @Pagination()
    @UserQuery()
    findAllUsers(@Query() queryDto: FindAllUsersDto) {
        return this.adminService.findAllUsers(queryDto);
    }

    @Get("/user/:id")
    @ApiOperation({ summary: "Toggle ban user" })
    toggleBanUser(@Param("id") id: string) {
        return this.adminService.toggleBanUser(+id);
    }

    @Get("/genre")
    @ApiOperation({ summary: "Get all genres" })
    @Pagination()
    findAllGenres(@Query() paginationDto: PaginationDto) {
        return this.adminService.findAllGenres(paginationDto);
    }

    @Post("/genre")
    @ApiConsumes(FormType.Multipart)
    @ApiOperation({ summary: "Create a new genre" })
    @UseInterceptors(UploadFileS3("cover"))
    create(
        @Body() createGenreDto: CreateGenreDto,
        @UploadedFile(OptionalImageValidation) cover?: Express.Multer.File,
    ) {
        return this.adminService.createGenre(createGenreDto, cover);
    }

    @Patch("/genre/:id")
    @ApiConsumes(FormType.Multipart)
    @ApiOperation({ summary: "Update a genre by ID" })
    @UseInterceptors(UploadFileS3("cover"))
    update(
        @Param("id") id: string,
        @Body() updateGenreDto: UpdateGenreDto,
        @UploadedFile(OptionalImageValidation) cover: Express.Multer.File,
    ) {
        return this.adminService.updateGenre(+id, updateGenreDto, cover);
    }

    @Delete("/genre/:id")
    @ApiOperation({ summary: "Delete a genre by ID" })
    remove(@Param("id") id: string) {
        return this.adminService.removeGenre(+id);
    }

    @Get("/playlist")
    @ApiOperation({ summary: "Get all playlists filtered by status" })
    @Pagination()
    @PlaylistQuery()
    findAllPlaylist(@Query() queryDto: FindAllPlaylistDto) {
        return this.adminService.findAllPlaylists(queryDto);
    }

    @Get("/song")
    @ApiOperation({ summary: "Get all songs filtered by status" })
    @SongFilterStatus()
    findAll(@Query("status") status: SongStatus) {
        return this.adminService.findAllSongs(status);
    }
}
