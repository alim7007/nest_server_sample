import aws from 'aws-sdk';
import { resolve } from 'path';
import nodemailer, { Transporter } from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';
import Email from 'email-templates';
import { emailConstants } from './email.constants';
import { SendEmailParams } from './dto/email.dto';

@Injectable()
export class EmailService {
    private readonly transport: Transporter;
    private readonly from: string;
    private readonly send: boolean;
    private logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger('EmailService');

        const awsConfig = {
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', ''),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
            region: this.configService.get('AWS_REGION', ''),
        };

        const sesConfig = {
            SES: new aws.SES({ apiVersion: '2010-12-01' }),
            sendingRate: 1,
        };

        aws.config.update(awsConfig);

        this.transport = nodemailer.createTransport(sesConfig);
        this.from = this.configService.get('EMAIL_FROM', '');
        this.send = Boolean(process.env.NODE_ENV !== 'test');
    }

    async sendMail({ to, cc, bcc, emailType, locals }: SendEmailParams): Promise<boolean> {
        if (!to) {
            this.logger.error(`sendMail cannot send email with empty recipient!`);
            return false;
        }

        if (!this.from) {
            this.logger.error(`Please check your enviroment's vars setted properly!`);
            return false;
        }

        if (!locals?.fullName) {
            locals.fullName = emailConstants.defaultClientName;
        }

        const template = resolve(`templates/email/${emailType}`);

        const message: Mail.Options = { to, from: this.from };

        if (cc?.length) {
            message.cc = cc;
        }

        if (bcc?.length) {
            message.bcc = bcc;
            delete message.to;
        }

        const email = new Email({
            message,
            send: this.send,
            preview: false,
            transport: this.transport,
        });

        this.send &&
            this.logger.debug(`sending email to: ${to}, emailType: ${emailType}, locals: ${JSON.stringify(locals)}`);

        return await email
            .send({
                template,
                locals,
            })
            .then((mail: any) => !!mail)
            .catch((err: any) => {
                this.logger.error(err);
                this.logger.error(err.stack);
                return false;
            });
    }
}