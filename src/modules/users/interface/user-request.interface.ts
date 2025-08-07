import { Role } from "../enum/user.enum";

export interface IUser {
    id: number;
    fullName: string;
    username: string;
    email: string;
    role: Role;
}
