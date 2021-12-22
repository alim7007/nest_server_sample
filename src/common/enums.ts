export enum StatusType {
    Active = 'ACTIVE',
    Disabled = 'DISABLED',
    Deleted = 'DELETED',
}

export enum AccountType {
    Provider = 'PROVIDER',
    Renter = 'RENTER',
    Both = 'BOTH',
}

export enum AuthType {
    Email = 'EMAIL',
    Apple = 'APPLE',
    Google = 'GOOGLE',
    Facebook = 'FACEBOOK',
}

export enum OtpType {
    CurrentEmail = 'CURRENT_EMAIL',
    CurrentPhone = 'CURRENT_PHONE',
    ResetPassword = 'RESET_PASSWORD',
    ChangeEmail = 'CHANGE_EMAIL',
    ChangePhone = 'CHANGE_PHONE'
}

export enum AccountSelector {
    Provider = 'PROVIDER',
    Renter = 'RENTER'
}

export enum GenderType {
    Male = 'MALE',
    Female = 'FEMALE',
    Other = 'OTHER',
}

export enum RequestStatusType {
    Sent = 'SENT',
    Deleted = 'DELETED',
}


export enum RequestType {
    Friendship = 'FRIENDSHIP',
    Workout = 'WORKOUT',
    Rewards = 'REWARDS',
    Progress = 'PROGRESS',
}

export enum UserReactionStatusType {
    Pending = 'PENDING',
    Accepted = 'ACCEPTED',
    Declined = 'DECLINED',
}

export enum UserReactionType {
    Accepted = 'ACCEPTED',
    Declined = 'DECLINED',
}

export enum FriendshipStatusType {
    Friends = 'FRIENDS',
    NotFriends = 'NOT_FRIENDS',
}

