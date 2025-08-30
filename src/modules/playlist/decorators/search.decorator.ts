import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function Search() {
    return applyDecorators(
        ApiQuery({
            name: "playlistId",
            example: 1,
            type: "string",
        }),
        ApiQuery({
            name: "q",
            example: "shadmehr",
            type: "string",
        }),
    );
}