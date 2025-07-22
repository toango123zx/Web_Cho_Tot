export const calculatePagesCount = (pageSize: number, totalCount: number) => {
    if (pageSize <= 0) {
        throw new Error('Page size must be greater than 0');
    }
    if (totalCount < 0) {
        throw new Error('Total count cannot be negative');
    }
    return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
}