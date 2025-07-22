import { MatPaginatorIntl } from '@angular/material/paginator';

export class MatPaginatorIntlAr extends MatPaginatorIntl {
    override itemsPerPageLabel = 'عدد العناصر في الصفحة:';
    override nextPageLabel = 'الصفحة التالية';
    override previousPageLabel = 'الصفحة السابقة';
    override firstPageLabel = 'الصفحة الأولى';
    override lastPageLabel = 'الصفحة الأخيرة';

// Customize the range label to suit Arabic
    override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
    return `0 من ${length}`;
    }
    const startIndex = page * pageSize;
    // Ensure that the end index does not exceed the list length
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} من ${length}`;
};
}
