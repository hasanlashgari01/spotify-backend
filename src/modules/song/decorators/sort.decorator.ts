import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { Pagination } from "src/common/decorators/pagination.decorator";

export function SortSongs() {
    return applyDecorators(
        ApiQuery({
            name: "sortBy",
            description: "Sort songs by field",
            enum: ["title", "artist", "duration", "createdAt"],
            required: false,
        }),
        ApiQuery({
            name: "order",
            description: "Sort order",
            enum: ["ASC", "DESC"],
            required: false,
        }),
    );
}

export function SongsSlugQuery() {
    return applyDecorators(Pagination(), SortSongs());
}
