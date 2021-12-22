import { ApiErrorResponse } from './dto';

const errorText: Record<string, string> = {
    API_ERROR_INCORRECT_INPUT_DATA: 'Please check the entered data',
    API_ERROR_INTERNAL_SERVER_ERROR: 'Problem with processing your request',
    API_ERROR_WRONG_APP_KEY: 'Wrong API app key',
    API_ERROR_ACCESS_DENIED: 'Access denied',
    API_ERROR_WRONG_INPUT: 'Wrong input data',
    API_ERROR_WRONG_INPUT_EMAIL: 'Enter valid email address (ex. name@email.com)',
    API_ERROR_WRONG_INPUT_PASSWORD: 'Password is not strong enough',
    API_ERROR_WRONG_INPUT_PHONE: 'Enter valid phone number in the international format (ex. +11234567890)',
    API_ERROR_NOT_IMPLEMENTED: 'API is not implemented on server side',
    API_ERROR_EMAIL_ALREADY_REGISTERED: 'Email is already registered. Please check the entered data',
    API_ERROR_USER_CREDENTIAL_NOT_FOUND: 'This user do not have password',
    API_ERROR_INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect Email Or Password',
    API_ERROR_USER_NOT_FOUND_BY_EMAIL: 'This email is not registered',
    API_ERROR_EMAIL_ALREADY_VERIFIED: 'Your email is already verified',
    API_ERROR_PASSWORD_NOT_MATCH: 'You’ve entered an incorrect current password',
    API_ERROR_OTP_CODE_EXPIRED: 'Your verification code is incorrect or has expired, please request a new one',
    API_ERROR_WRONG_PASSWORD_RECOVERY_TOKEN: 'Recovery token is wrong',
    API_ERROR_PASSWORD_RECOVERY_TOKEN_EXPIRED:
        'Your recovery token is incorrect or has expired, please request a new one',
    API_ERROR_USER_EMAIL_IS_NOT_VERIFIED: 'You should verify your email first',
    API_ERROR_IMAGE_FILE_REQUIRED: 'Please select an image file',
    API_ERROR_WRONG_IMAGE_FORMAT: 'Your image should be .JPG or .PNG format',
    API_ERROR_FILE_TOO_LARGE: 'The file is too large',
    API_ERROR_ACCOUNT_INACTIVE: 'Your account has been banned due to the complaints from users',
    API_ERROR_EMAIL_INCORRECT: 'Email is incorrect. Please check the entered data.',
    API_ERROR_USER_NOT_FOUND: 'User not found',
    API_ERROR_PHONE_MUST_BE_UNIQUE: 'Phone numbers must be unique',
    API_ERROR_PHONE_ALREADY_VERIFIED: 'Phone number already verified',
    API_ERROR_USER_PHONE_IS_NOT_VERIFIED: 'You must verify your phone number first',
    API_ERROR_ACCOUNT_TYPE_MISMATCH: 'User account type mismatch for a particular operation',
    API_ERROR_SELLER_PROFILE_NOT_FOUND: 'Seller profile not found',
    API_ERROR_PROPERTY_PRIMARY_INFO_INCOMPLETE: 'Property primary info of the profile must be completed beforehand',
    API_ERROR_PROPERTY_PHOTOS_MISSING: 'At least 1 property photo must be added',
    API_ERROR_BUYER_PROFILE_NOT_FOUND: 'Buyer profile not found',
    API_ERROR_CANNOT_UNMATCH_PROFILE: 'Cannot unmatch a certain profile',
    API_ERROR_MAXIMUM_PROPERTY_PHOTOS_COUNT: 'Maximum property photos count exceeded',
    API_ERROR_CONFLICLING_DATA: 'Conflicling user input detected',
    API_ERROR_MIN_AND_MAX_VALUES_NOT_CORRECT: 'Minimum and maximum values not in correct format',
    API_ERROR_VALUE_BEYOND_MAXIMUM: "The value you've entered is beyond the allowed maximum",
    API_ERROR_MUST_VALIDATE_CURRENT_PHONE_BEFOREHAND: "The current phone must be verified beforehand",
    API_ERROR_MUST_VALIDATE_CURRENT_EMAIL_BEFOREHAND: "The current email must be verified beforehand",
    API_ERROR_PRICE_MUST_BE_POSITIVE: "Price value must be positive",
    API_ERROR_PROPERTY_NOT_FOUND: "Property not found",
    API_ERROR_INVALID_ZIPCODE: 'Invalid zipcode provided'
};

const translate = (key: string): string => {
    return errorText[key] ?? key;
};

// Api Error Code
export enum ApiEC {
    InternalServerError = 1,
    WrongAppKey = 2,
    AccessDenied = 3,
    WrongInput = 4,
    NotImplemented = 5,
    EmailAlreadyRegistered = 6,
    UserCredentialNotFound = 7,
    IncorrectEmailOrPassword = 8,
    UserNotFoundByEmail = 9,
    EmailAlreadyVerified = 10,
    PasswordNotMatch = 11,
    OTPCodeExpired = 12,
    WrongPasswordRecoveryToken = 13,
    PasswordRecoveryTokenExpired = 14,
    UserEmailIsNotVerified = 15,
    ImageFileRequired = 16,
    WrongImageFormat = 17,
    FileTooLarge = 18,
    AccountInactiveOrBanned = 19,
    EmailIncorrect = 20,
    UserNotFound = 21,
    AlreadyFriends = 22,
    WrongPhoneNumber = 23,
    PhoneMustBeUnique = 24,
    PhoneAlreadyVerified = 25,
    UserPhoneIsNotVerified = 26,
    AccountTypeMismatch = 27,
    SellerProfileNotFound = 28,
    PropertyPrimaryInfoIncomplete = 29,
    PropertyPropertyMissing = 30,
    BuyerProfileNotFound = 31,
    CannotUnmatchProfile = 32,
    MaximumPropertyCountExceeded = 33,
    ConflictingData = 34,
    MinAndMaxValuesNotCorrect = 35,
    ValueBeyondMaximum = 36,
    MustValidateCurrentPhoneBeforeHand = 37,
    MustValidateCurrentEmailBeforeHand = 38,
    PriceMustBePositive = 39,
    PropertyNotFound = 40,
    InvalidZipCode = 41
}

export class ApiException extends Error {
    private readonly _errorCode: ApiEC;

    constructor(errorCode: ApiEC, message?: string) {
        super(message ?? ApiException.defaultMessageKeyForErrorCode(errorCode));
        this._errorCode = errorCode;
    }

    toErrorDTO(): ApiErrorResponse {
        const title = ApiException.titleForErrorCode(this._errorCode);
        const body = ApiException.bodyForErrorCode(this._errorCode);
        return {
            errorCode: this._errorCode,
            title: title ? translate(title) : undefined,
            message: translate(body),
        };
    }

    private static defaultMessageKeyForErrorCode(errorCode: ApiEC): string {
        switch (errorCode) {
            case ApiEC.InternalServerError:
                return 'API_ERROR_INTERNAL_SERVER_ERROR';
            case ApiEC.WrongAppKey:
                return 'API_ERROR_WRONG_APP_KEY';
            case ApiEC.AccessDenied:
                return 'API_ERROR_ACCESS_DENIED';
            case ApiEC.WrongInput:
                return 'API_ERROR_WRONG_INPUT';
            case ApiEC.NotImplemented:
                return 'API_ERROR_NOT_IMPLEMENTED';
            case ApiEC.EmailIncorrect:
                return 'API_ERROR_EMAIL_INCORRECT';
            case ApiEC.EmailAlreadyRegistered:
                return 'API_ERROR_EMAIL_ALREADY_REGISTERED';
            case ApiEC.UserCredentialNotFound:
                return 'API_ERROR_USER_CREDENTIAL_NOT_FOUND';
            case ApiEC.IncorrectEmailOrPassword:
                return 'API_ERROR_INCORRECT_EMAIL_OR_PASSWORD';
            case ApiEC.UserNotFoundByEmail:
                return 'API_ERROR_USER_NOT_FOUND_BY_EMAIL';
            case ApiEC.EmailAlreadyVerified:
                return 'API_ERROR_EMAIL_ALREADY_VERIFIED';
            case ApiEC.PasswordNotMatch:
                return 'API_ERROR_PASSWORD_NOT_MATCH';
            case ApiEC.OTPCodeExpired:
                return 'API_ERROR_OTP_CODE_EXPIRED';
            case ApiEC.WrongPasswordRecoveryToken:
                return 'API_ERROR_WRONG_PASSWORD_RECOVERY_TOKEN';
            case ApiEC.PasswordRecoveryTokenExpired:
                return 'API_ERROR_PASSWORD_RECOVERY_TOKEN_EXPIRED';
            case ApiEC.UserEmailIsNotVerified:
                return 'API_ERROR_USER_EMAIL_IS_NOT_VERIFIED';
            case ApiEC.ImageFileRequired:
                return 'API_ERROR_IMAGE_FILE_REQUIRED';
            case ApiEC.WrongImageFormat:
                return 'API_ERROR_WRONG_IMAGE_FORMAT';
            case ApiEC.FileTooLarge:
                return 'API_ERROR_FILE_TOO_LARGE';
            case ApiEC.AccountInactiveOrBanned:
                return 'API_ERROR_ACCOUNT_INACTIVE';
            case ApiEC.UserNotFound:
                return 'API_ERROR_USER_NOT_FOUND';
            case ApiEC.AlreadyFriends:
                return 'API_ERROR_ALREADY_FRIENDS';
            case ApiEC.WrongPhoneNumber:
                return 'API_ERROR_WRONG_INPUT_PHONE'
            case ApiEC.PhoneMustBeUnique:
                return 'API_ERROR_PHONE_MUST_BE_UNIQUE'
            case ApiEC.PhoneAlreadyVerified:
                return 'API_ERROR_PHONE_ALREADY_VERIFIED'
            case ApiEC.UserPhoneIsNotVerified:
                return 'API_ERROR_USER_PHONE_IS_NOT_VERIFIED';
            case ApiEC.AccountTypeMismatch:
                return 'API_ERROR_ACCOUNT_TYPE_MISMATCH';
            case ApiEC.SellerProfileNotFound:
                return 'API_ERROR_SELLER_PROFILE_NOT_FOUND';
            case ApiEC.PropertyPrimaryInfoIncomplete:
                return 'API_ERROR_PROPERTY_PRIMARY_INFO_INCOMPLETE';
            case ApiEC.PropertyPropertyMissing:
                return 'API_ERROR_PROPERTY_PHOTOS_MISSING';
            case ApiEC.BuyerProfileNotFound:
                return 'API_ERROR_BUYER_PROFILE_NOT_FOUND';
            case ApiEC.CannotUnmatchProfile:
                return 'API_ERROR_CANNOT_UNMATCH_PROFILE';
            case ApiEC.MaximumPropertyCountExceeded:
                return 'API_ERROR_MAXIMUM_PROPERTY_PHOTOS_COUNT';
            case ApiEC.ConflictingData:
                return 'API_ERROR_CONFLICLING_DATA';
            case ApiEC.MinAndMaxValuesNotCorrect:
                return 'API_ERROR_MIN_AND_MAX_VALUES_NOT_CORRECT';
            case ApiEC.ValueBeyondMaximum:
                return 'API_ERROR_VALUE_BEYOND_MAXIMUM';
            case ApiEC.MustValidateCurrentPhoneBeforeHand:
                return 'API_ERROR_MUST_VALIDATE_CURRENT_PHONE_BEFOREHAND';
            case ApiEC.MustValidateCurrentEmailBeforeHand:
                return 'API_ERROR_MUST_VALIDATE_CURRENT_EMAIL_BEFOREHAND';
            case ApiEC.PriceMustBePositive:
                return 'API_ERROR_PRICE_MUST_BE_POSITIVE';
            case ApiEC.PropertyNotFound:
                return 'API_ERROR_PROPERTY_NOT_FOUND'
            case ApiEC.InvalidZipCode:
                return 'API_ERROR_INVALID_ZIPCODE'
            default:
                return '';
        }
    }

    private static titleForErrorCode(errorCode: ApiEC): string | null {
        switch (errorCode) {
            case ApiEC.IncorrectEmailOrPassword:
                return 'API_ERROR_INCORRECT_EMAIL_OR_PASSWORD';
            case ApiEC.UserNotFoundByEmail:
                return 'API_ERROR_USER_NOT_FOUND_BY_EMAIL';
        }

        return null;
    }

    private static bodyForErrorCode(errorCode: ApiEC): string {
        switch (errorCode) {
            case ApiEC.IncorrectEmailOrPassword:
            case ApiEC.UserNotFoundByEmail:
                return 'API_ERROR_INCORRECT_INPUT_DATA';
        }

        return ApiException.defaultMessageKeyForErrorCode(errorCode);
    }
}
