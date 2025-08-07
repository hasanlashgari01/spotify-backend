import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { AuthWithRole } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    @ApiOperation({ summary: "Register a new user" })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post("/login")
    @ApiConsumes(FormType.Urlencoded, FormType.Json)
    @ApiOperation({ summary: "Login with email and password" })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get("/me")
    @AuthWithRole()
    @ApiOperation({ summary: "Get current logged-in user profile" })
    getProfile(@Req() req: Request) {
        return req.user;
    }
}
