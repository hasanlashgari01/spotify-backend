import { applyDecorators } from "@nestjs/common";
import { ApiParam, ApiQuery } from "@nestjs/swagger";

export function SortSongs() {
    return applyDecorators(
        ApiParam({
            name: "slug",
            description: "Slug of the playlist",
            type: String,
        }),
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
        })
    );
}