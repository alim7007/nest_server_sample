import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { ApiSecurity, ApiTags, ApiBadRequestResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiErrorResponse } from 'src/exceptions/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserPassport } from 'src/decorators/user.passport.decorator';
import { SetupUserProfileRequest, UpdateUserProfileRequest, UserProfileResponse } from './dto';
import { ProfileService } from './profile.service';
import { ApiFile } from 'src/decorators';
import { uploadImageParams } from 'src/services/s3';
import { UserBaseInfoSuccessResponse } from '../user/dto';
import { User } from 'src/models';

@ApiSecurity('X_API_KEY')
@ApiSecurity('X_SESSION_KEY')
@ApiTags('Profile')
@ApiBadRequestResponse({
    description: 'Bad response',
    type: ApiErrorResponse,
})
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get('get-user-profile')
    @ApiOperation({ summary: "Get User's profile" })
    async getUserProfile(@UserPassport() user: User): Promise<UserProfileResponse> {
        return this.profileService.getUserProfile(user);
    }

    @Post('setup-user-profile')
    async setupUserProfile(
        @UserPassport() user: User,
        @Body() dto: SetupUserProfileRequest
    ): Promise<UserProfileResponse> {
        return this.profileService.setupUserProfile(user, dto);
    }

    @Post('update-user-profile')
    async updateUserProfile(
        @UserPassport() user: User,
        @Body() dto: UpdateUserProfileRequest
    ): Promise<UserProfileResponse> {
        return this.profileService.updateUserProfile(user, dto);
    }

    @Post('set-user-avatar')
    @ApiConsumes('multipart/form-data')
    @ApiFile('avatar')
    @UseInterceptors(FileInterceptor('avatar', uploadImageParams))
    async setUserAvatar(
        @UserPassport() user: User,
        @UploadedFile() avatar: Express.Multer.File
    ): Promise<UserBaseInfoSuccessResponse> {
        return this.profileService.setUserAvatar(user, avatar);
    }

    @Post('delete-user-avatar')
    async deleteUserAvatar(@UserPassport() user: User): Promise<UserBaseInfoSuccessResponse> {
        return this.profileService.deleteUserAvatar(user);
    }
}