import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { Auth, OptionalAuth } from "src/common/decorators/auth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { FormType } from "src/common/enum/form-type.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { OptionalImageValidation } from "src/common/utils/upload.utils";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { UpdatePlaylistDto } from "./dto/update-playlist.dto";
import { PlaylistsService } from "./playlists.service";

@Controller("playlists")
export class PlaylistsController {
    constructor(private readonly playlistsService: PlaylistsService) {}

    @Post()
    @Auth()
    @ApiConsumes(FormType.Multipart)
    @ApiOperation({ summary: "Create a new playlist" })
    @UseInterceptors(UploadFileS3("cover"))
    create(
        @Body() createPlaylistDto: CreatePlaylistDto,
        @UploadedFile(OptionalImageValidation) cover?: Express.Multer.File,
    ) {
        return this.playlistsService.create(createPlaylistDto, cover);
    }

    @Get()
    @OptionalAuth()
    @ApiOperation({ summary: "Get all playlists (optional auth)" })
    @Pagination()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.playlistsService.findAllPublic(paginationDto);
    }

    @Patch("/:playlistId/song/:songId")
    @Auth()
    @ApiOperation({ summary: "Add song to playlist" })
    addSongToPlaylist(@Param("playlistId") playlistId: string, @Param("songId") songId: string) {
        return this.playlistsService.addSongToPlaylist(+playlistId, +songId);
    }

    @Delete("/:playlistId/song/:songId")
    @Auth()
    @ApiOperation({ summary: "Remove song from playlist" })
    removeSongFromPlaylist(
        @Param("playlistId") playlistId: string,
        @Param("songId") songId: string,
    ) {
        return this.playlistsService.removeSongFromPlaylist(+playlistId, +songId);
    }

    @Get("/:playlistId/toggle-like")
    @Auth()
    @ApiOperation({ summary: "Like or unlike a playlist" })
    toggleLike(@Param("playlistId") playlistId: string) {
        return this.playlistsService.toggleLike(+playlistId);
    }

    @Get("/my")
    @Auth()
    @ApiOperation({ summary: "Get my playlists" })
    @Pagination()
    myPlaylist(@Query() paginationDto: PaginationDto) {
        return this.playlistsService.myPlaylist(paginationDto);
    }

    @Get("/like")
    @Auth()
    @ApiOperation({ summary: "Get liked playlists" })
    myPlaylistLiked() {
        return this.playlistsService.myPlaylistLiked();
    }

    @Get(":slug")
    @OptionalAuth()
    @ApiOperation({ summary: "Get playlist details by slug (optional auth)" })
    findOne(@Param("slug") slug: string) {
        return this.playlistsService.findOne(slug);
    }

    @Put(":id")
    @Auth()
    @ApiOperation({ summary: "Toggle active/inactive status of a playlist" })
    toggleStatus(@Param("id") id: string) {
        return this.playlistsService.toggleStatus(+id);
    }

    @Patch(":id")
    @Auth()
    @ApiConsumes(FormType.Multipart)
    @ApiOperation({ summary: "Update a playlist" })
    @UseInterceptors(UploadFileS3("cover"))
    update(
        @Param("id") id: string,
        @Body() updatePlaylistDto: UpdatePlaylistDto,
        @UploadedFile(OptionalImageValidation) cover?: Express.Multer.File,
    ) {
        return this.playlistsService.update(+id, updatePlaylistDto, cover);
    }

    @Delete(":id")
    @Auth()
    @ApiOperation({ summary: "Delete a playlist" })
    remove(@Param("id") id: string) {
        return this.playlistsService.remove(+id);
    }
}
