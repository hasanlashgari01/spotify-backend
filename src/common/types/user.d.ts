import { AuthJwtPayload } from "src/modules/auth/types/auth-payload";

declare global {
    namespace Express {
        interface Request {
            user?: AuthJwtPayload;
        }
    }
}
