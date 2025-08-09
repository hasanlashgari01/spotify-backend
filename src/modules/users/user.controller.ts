import { Body, Controller, Get, Param, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { Auth, OptionalAuth, UserOnly } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { UploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { ImageValidation } from "src/common/utils/upload.utils";
import { UpdateProfileDto } from "./dto/profile.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("/profile/:username")
    @OptionalAuth()
    @ApiOperation({
        summary: "Get user profile by username (optional auth)",
        description:
            "Returns a user's profile by username. If profile is public, it shows normally. If private, user must be followed.",
    })
    getProfile(@Param("username") username: string) {
        return this.userService.getProfile(username);
    }

    @Put("/my-profile")
    @Auth()
    @ApiConsumes(FormType.Multipart)
    @ApiOperation({ summary: "Update user profile information" })
    @UseInterceptors(UploadFileS3("avatar"))
    updateProfile(
        @Body() profileDto: UpdateProfileDto,
        @UploadedFile(ImageValidation) avatar: Express.Multer.File,
    ) {
        return this.userService.updateProfile(profileDto, avatar);
    }

    @Get("/my-profile")
    @Auth()
    @ApiOperation({ summary: "Get my profile" })
    myProfile() {
        return this.userService.myProfile();
    }

    @Get("/status")
    @Auth()
    @ApiOperation({ summary: "Toggle user active/inactive status" })
    toggleStatus() {
        return this.userService.toggleStatus();
    }

    @Get()
    @UserOnly()
    @ApiOperation({ summary: "Convert user role to artist" })
    promoteToArtist() {
        return this.userService.promoteToArtist();
    }
}
