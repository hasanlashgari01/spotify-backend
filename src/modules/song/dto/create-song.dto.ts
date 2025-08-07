import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SongStatus } from "src/common/enum/song.enum";

export class CreateSongDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiPropertyOptional({ type: "string", format: "binary" })
    @IsOptional()
    audio?: Express.Multer.File;

    @ApiProperty({ enum: SongStatus, default: SongStatus.PUBLISHED })
    @IsEnum(SongStatus)
    status?: SongStatus;

    @ApiProperty()
    @IsString()
    genreId: string;
}
