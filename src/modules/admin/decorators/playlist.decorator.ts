import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { Status } from "src/modules/playlist/enum/status.enum";

export function PlaylistQuery() {
    return applyDecorators(
        ApiQuery({
            name: "status",
            required: false,
            type: "enum",
            enum: Status,
            default: null,
        }),
    );
}
