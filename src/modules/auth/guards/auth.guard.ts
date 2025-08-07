import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorator";
import { AuthService } from "../auth.service";
import { extractToken } from "../utils/extract-token.utils";
import { AuthMessage } from "src/common/enum/message.enum";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private reflector: Reflector,
    ) {}
    async canActivate(context: ExecutionContext) {
        const isSkippedAuthorization = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler());
        if (isSkippedAuthorization) return true;
        const request: Request = context.switchToHttp().getRequest();
        const token = extractToken(request);
        const payload = await this.authService.validateAccessToken(token);
        if (payload?.isBan) throw new ForbiddenException(AuthMessage.Banned);

        request.user = payload;

        return true;
    }
}
