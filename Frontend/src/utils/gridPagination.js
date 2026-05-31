export const gridPageSizeOptions = [10, 25, 50, 100];

export const getDefaultPageSize = (rowCount) => (rowCount >= 50 ? 50 : 25);
