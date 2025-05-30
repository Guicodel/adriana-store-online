
export interface CategoriesResponse {
    total:      number;
    categories: Category[];
}

export interface Category {
    _id:      string;
    name:     string;
    state:    boolean;
    section?: string;
}
export interface newCategory{
    name:string,
    section:string
}
export interface updateCategory{
    name?:string,
    section?:string
}