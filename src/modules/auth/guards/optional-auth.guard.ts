import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "../auth.service";
import { extractTokenOptional } from "../utils/extract-token.utils";
import { AuthMessage } from "src/common/enum/message.enum";

@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = extractTokenOptional(request);

        if (token) {
            try {
                const payload = await this.authService.validateAccessToken(token);
                if (payload?.isBan) throw new ForbiddenException(AuthMessage.Banned);

                request.user = payload;
            } catch (err: unknown) {
                if (err instanceof Error) console.error("Token validation error:", err.message);

                request.user = undefined;

                throw new UnauthorizedException(AuthMessage.LoginRequired);
            }
        }

        return true;
    }
}
