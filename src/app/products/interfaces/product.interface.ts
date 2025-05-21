import { User } from "../../auth/interfaces/user.interface";
import { Category } from "../../categories/interfaces/category.inteface";

export interface ProductsResponse {
    total:    number;
    products: Product[];
}

export interface Product {
    _id:         string;
    name:        string;
    state:       boolean;
    section:     string;
    categoryId:  Category;
    description: string;
    userId:      User;
    size:        string[];
    price:       number;
    stock:       number;
    available:   boolean;
    img:         string[];
    brand:       string;
    gender:      string;

}

export interface ImageOptions{
  productId:string,
  productImg:string[]
}


export enum Size {
    M = "M",
    S = "S",
    Xl = "XL",
}
