import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLES_KEY } from "src/common/decorators/role.decorator";
import { AuthMessage } from "src/common/enum/message.enum";
import { extractToken } from "../utils/extract-token.utils";
import { AuthService } from "../auth.service";
import { Role } from "src/modules/users/enum/user.enum";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const httpContext = context.switchToHttp();
        const request: Request = httpContext.getRequest();
        const token = extractToken(request);
        const payload = await this.authService.validateAccessToken(token);
        if (payload?.isBan) throw new ForbiddenException(AuthMessage.Banned);

        if (requiredRoles && !requiredRoles.includes(payload.role)) {
            throw new UnauthorizedException(AuthMessage.NotAccess);
        }

        request.user = payload;
        return true;
    }
}
