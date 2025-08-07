import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { Gender, Role, Status } from "src/modules/users/enum/user.enum";

export function UserQuery() {
    return applyDecorators(
        ApiQuery({
            name: "role",
            required: false,
            type: "enum",
            enum: Role,
            default: null,
        }),
        ApiQuery({
            name: "status",
            required: false,
            type: "enum",
            enum: Status,
            default: null,
        }),
        ApiQuery({
            name: "gender",
            required: false,
            type: "enum",
            enum: Gender,
            default: null,
        }),
    );
}
