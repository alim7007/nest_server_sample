export const dbNames = {
    users: {
        tableName: 'users',
    },
    credentials: {
        tableName: 'credentials',
        length: {
            salt: 64,
            hash: 1024,
        },
    },
    userSessions: {
        tableName: 'user_sessions',
    },
    otpCodes: {
        tableName: 'otp_codes',
    },
    resetTokens: {
        tableName: 'reset_password_tokens',
    },
};
