import { EmailType } from '../email.enums';

export class OutputLocalsParams {
    fullName?: string;
    friendName?: string;
    otpCode?: string;
    link?: string;
    messageBody?: string;
}

export class SendEmailParams {
    to: string;
    cc?: string[];
    bcc?: string[];
    emailType: EmailType;
    locals: OutputLocalsParams;
}