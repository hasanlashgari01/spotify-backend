import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { Pagination } from "src/common/decorators/pagination.decorator";

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
    return applyDecorators(SortSongs(), Pagination());
}
