export class ListResult<T> {
    public items: T[];
    public total: number;

    constructor(items?: T[], total?: number) {
        this.items = items || [];
        this.total = total || 0;
    }
}
