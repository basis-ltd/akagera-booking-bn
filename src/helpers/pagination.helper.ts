export interface Pagination {
    take?: number;
    skip?: number;
    rows: Array<object>;
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

export const getPagingData = (data: any, take = 10, skip = 0) => {
    return {
        rows: data && data[0],
        totalCount: data && data[1],
        totalPages: Math.ceil(data && Number(data[1]) / Number(take)),
        currentPage: Number(skip) + 1,
    }
};
