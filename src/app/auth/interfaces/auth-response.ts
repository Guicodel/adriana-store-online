import { User } from "./user.interface";

export interface AuthCheckResponse {
    authUser:  User;
    token: string;
}
export interface AuthLoginResponse {
    user:  User;
    token: string;
}