import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function SortSongs() {
    return applyDecorators(
        ApiQuery({
            name: "q",
            required: true,
        }),
        ApiQuery({
            name: "filter",
            enum: ["artist", "song", "playlist", "user"],
            required: false,
        }),
    );
}

export function SearchQuery() {
    return applyDecorators(
        SortSongs(),
        ApiQuery({
            name: "page",
            example: 1,
            required: false,
            type: "integer",
        }),
    );
}
