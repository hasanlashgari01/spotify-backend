import { Role, Status } from "../../users/enum/user.enum";

export type AuthJwtPayload = {
    sub: number;
    email: string;
    role: Role;
    isBan: boolean;
    status: Status;
};
