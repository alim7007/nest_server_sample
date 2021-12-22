export class PasswordRequest {
    password: string;
}

export class CheckPasswordRequest extends PasswordRequest {
    hash: string;
    salt: string;
}