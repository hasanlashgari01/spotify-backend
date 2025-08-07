import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { RoleGuard } from "src/modules/auth/guards/role.guard";
import { Role } from "src/modules/users/enum/user.enum";
import { Roles } from "./role.decorator";
import { OptionalAuthGuard } from "src/modules/auth/guards/optional-auth.guard";

export function Auth() {
    return applyDecorators(AuthWithRole());
}

export function AuthWithRole() {
    return applyDecorators(ApiBearerAuth("Authorization"), UseGuards(AuthGuard, RoleGuard));
}

export function ArtistOnly() {
    return applyDecorators(AuthWithRole(), Roles(Role.ARTIST));
}

export function UserOnly() {
    return applyDecorators(AuthWithRole(), Roles(Role.USER));
}

export function AdminOnly() {
    return applyDecorators(AuthWithRole(), Roles(Role.ADMIN));
}

export function UserOrArtist() {
    return applyDecorators(AuthWithRole(), Roles(Role.USER, Role.ARTIST));
}

export function OptionalAuth() {
    return applyDecorators(ApiBearerAuth("Authorization"), UseGuards(OptionalAuthGuard));
}
