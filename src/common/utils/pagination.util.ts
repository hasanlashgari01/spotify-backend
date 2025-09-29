import { PaginationDto } from "../dto/pagination.dto";

export function paginationSolver(paginationDto: PaginationDto) {
    let { page = 0, limit = 10 } = paginationDto;

    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip,
    };
}

export function paginationGenerator(count: number = 0, page: number = 1, limit: number = 10) {
    return {
        page,
        limit,
        pageCount: Math.ceil(count / limit),
        totalCount: count,
    };
}
