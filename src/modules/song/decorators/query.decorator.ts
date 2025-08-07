import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { SongStatus } from "src/common/enum/song.enum";

export function SongFilterStatus() {
    return applyDecorators(
        ApiQuery({
            name: "status",
            required: false,
            type: "enum",
            enum: SongStatus,
        }),
    );
}
