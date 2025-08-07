import {
    ConflictException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { AuthMessage, SuccessMessage } from "src/common/enum/message.enum";
import { Repository } from "typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { Role } from "../users/enum/user.enum";
import { LoginDto, RegisterDto } from "./dto/auth.dto";
import { AuthJwtPayload } from "./types/auth-payload";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const { name, email, username, password } = registerDto;

        await this.ensureEmailNotTaken(email);
        await this.ensureUsernameNotTaken(username);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({
            fullName: name,
            email,
            username,
            password: hashedPassword,
        });
        const usersCount = await this.userRepository.count();
        if (usersCount == 0) newUser.role = Role.ADMIN;

        await this.userRepository.save(newUser);

        return {
            ok: true,
            message: SuccessMessage.Register,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.getUserByEmailOrFail(email);
        if (user?.isBan) throw new ForbiddenException(AuthMessage.Banned);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException(AuthMessage.InvalidData);

        const { accessToken } = this.makeToken({
            sub: user.id,
            email: user.email,
            role: user.role,
            isBan: user.isBan,
            status: user.status,
        });

        return {
            ok: true,
            message: SuccessMessage.Login,
            accessToken,
        };
    }

    private async ensureEmailNotTaken(email: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (user) throw new ConflictException(AuthMessage.AlreadyExistEmail);
    }

    private async ensureUsernameNotTaken(username: string) {
        const existUsername = await this.userRepository.findOneBy({ username });
        if (existUsername) throw new ConflictException(AuthMessage.AlreadyExistUsername);
    }

    private async getUserByEmailOrFail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new ConflictException(AuthMessage.NotFoundAccount);

        return user;
    }

    makeToken(payload: AuthJwtPayload) {
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
        };
    }

    async validateAccessToken(token: string): Promise<AuthJwtPayload> {
        const payload = this.jwtService.verify<AuthJwtPayload>(token, {
            secret: process.env.JWT_SECRET,
        });

        if (typeof payload === "object" && payload?.sub) {
            const user = await this.userRepository.findOneBy({
                id: payload.sub,
            });
            if (!user) throw new UnauthorizedException(AuthMessage.LoginRequired);

            return {
                sub: user.id,
                email: user.email,
                role: user.role,
                isBan: user.isBan,
                status: user.status,
            };
        }
        throw new UnauthorizedException(AuthMessage.LoginRequired);
    }
}
