import moment from 'moment';
import { Injectable } from '@nestjs/common';
import { SetupUserProfileRequest, UpdateUserProfileRequest, UserProfileResponse } from './dto';
import { S3Service } from 'src/services/s3';
import { User } from 'src/models';
import { ApiEC, ApiException } from 'src/exceptions';
import { UserBaseInfoSuccessResponse } from '../user/dto';

@Injectable()
export class ProfileService {
    constructor(private readonly s3Service: S3Service) { }

    async getUserProfile(user: User): Promise<UserProfileResponse> {
        return { id: user.id, profile: user.toUserProfileInfoDTO() };
    }

    async setupUserProfile(user: User, dto: SetupUserProfileRequest): Promise<UserProfileResponse> {
        const dbProfile: Partial<User> = {
            first_name: dto.firstName,
            last_name: dto?.lastName || null,
            dob: moment(dto.dateOfBirth).format('YYYY-MM-DD'),
            gender: dto.gender,
            weight: dto.weight,
        };
        await user.$query().patchAndFetch(dbProfile);

        return { id: user.id, profile: user.toUserProfileInfoDTO() };
    }

    async updateUserProfile(user: User, dto: UpdateUserProfileRequest): Promise<UserProfileResponse> {
        const dbProfile: Partial<User> = {
            first_name: dto?.firstName,
            last_name: dto?.lastName === '' ? null : dto?.lastName,
            dob: dto?.dateOfBirth ? moment(dto.dateOfBirth).format('YYYY-MM-DD') : undefined,
            gender: dto?.gender,
            weight: dto?.weight,
        };
        await user.$query().patchAndFetch(dbProfile);

        return { id: user.id, profile: user.toUserProfileInfoDTO() };
    }

    async setUserAvatar(user: User, avatar: Express.Multer.File): Promise<UserBaseInfoSuccessResponse> {
        if (!avatar?.buffer?.length) {
            throw new ApiException(ApiEC.ImageFileRequired);
        }

        const uploadedImage = await this.s3Service.uploadImage(avatar.buffer, avatar.mimetype);
        if (!uploadedImage?.imageUrl) {
            throw new ApiException(ApiEC.InternalServerError);
        }

        const uploadedThumbnail = await this.s3Service.resizeImage({ key: uploadedImage.imageKey });

        if (user?.avatar) {
            await this.deleteUserAvatar(user);
        }

        await user.$query().patchAndFetch({ avatar: { ...uploadedImage, ...uploadedThumbnail } });

        if (!user?.avatar) {
            throw new ApiException(ApiEC.InternalServerError);
        }

        return { ok: true, user: user.toUserBaseInfoDTO() };
    }

    async deleteUserAvatar(user: User): Promise<UserBaseInfoSuccessResponse> {
        if (!user?.avatar?.imageUrl) {
            return { ok: true, user: user.toUserBaseInfoDTO() };
        }
        const delImageResult = await this.s3Service.deleteFile({
            url: user.avatar?.imageUrl,
            key: user.avatar?.imageKey,
        });
        const delThumbResult = await this.s3Service.deleteFile({
            url: user.avatar?.thumbnailUrl,
            key: user.avatar?.thumbnailKey,
        });

        if (!delImageResult && !delThumbResult) {
            throw new ApiException(ApiEC.InternalServerError);
        }

        await user.$query().patchAndFetch({ avatar: null });

        return { ok: true, user: user.toUserBaseInfoDTO() };
    }
}