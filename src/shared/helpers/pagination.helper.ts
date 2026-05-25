import { PageResponseDto } from 'src/common/dtos/page-response.dto';

export class PaginationHelper {
  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static buildPageResponse<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): PageResponseDto<T> {
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
