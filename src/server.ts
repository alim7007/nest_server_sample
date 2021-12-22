import { join } from 'path';
import { isArray } from 'lodash';
import basicAuth from 'express-basic-auth';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    Logger,
    PayloadTooLargeException,
    ValidationPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ApiException, ApiEC } from 'src/exceptions';
import { ValidationError } from 'class-validator';
import { ApiModulesList } from './api/api.modules.list';
import express from 'express';

const logger = new Logger('ApiServer');
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if (exception?.stack) {
            logger.error(exception.stack);
        }

        logger.error(
            `Route error: ${exception}, originalUrl: ${request.url}, ips:[${request?.ips?.length ? request?.ips : request.ip
            }]`
        );

        let apiException: ApiException;

        if (exception instanceof PayloadTooLargeException) {
            if (exception?.message === 'File too large') {
                exception = new ApiException(ApiEC.FileTooLarge);
            }
        }

        if (exception instanceof ApiException) {
            apiException = exception;
        } else if (isArray(exception) && exception.length > 0 && exception[0] instanceof ValidationError) {
            const validationErrorConstraints = exception[0].constraints ? Object.values(exception[0].constraints!) : [];

            const validateErrorMsg =
                validationErrorConstraints.length > 0 && validationErrorConstraints[0].startsWith('API_')
                    ? validationErrorConstraints[0]
                    : undefined;
            apiException = new ApiException(ApiEC.WrongInput, validateErrorMsg);
        } else {
            apiException = new ApiException(ApiEC.InternalServerError);
        }
        const errorResponseDTO = apiException.toErrorDTO();
        if (exception instanceof ApiException || process.env.NODE_ENV === 'production') {
            response.status(400).json(errorResponseDTO);

        } else {
            response.status(400).json({ ...errorResponseDTO, exception });
        }
    }
}

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = new ConfigService();
    const port = parseInt(configService.get('API_PORT', '3000'), 10);
    const apiRoutePrefix = configService.get('API_ROUTE_PREFIX', 'api');
    const apiDoc = configService.get('SWAGGER_DOC_URL', 'api-docs');
    const isSwaggerOn = configService.get('IS_SWAGGER_UI_ACTIVE', 'false').toLowerCase() === 'true';

    app.useGlobalPipes(new ValidationPipe({ exceptionFactory: (errors) => errors, transform: true, whitelist: true }));
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.enable('trust proxy'); //TODO check
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.use(express.urlencoded({
        extended: false,
        limit: configService.get('MAX_SIZE_BODY_REQUEST', '15mb')
    }));
    if (isSwaggerOn) {
        app.use(
            [`/${apiDoc}`, `/${apiDoc}-json`],
            basicAuth({
                challenge: true,
                users: {
                    [configService.get('BASIC_AUTH_USER_NAME', 'admin')]: configService.get(
                        'BASIC_AUTH_PASSWORD',
                        'Messapps@1'
                    ),
                },
            })
        );
        const apiGuideLink = configService.get('API_GUIDE_LINK', ''); //TODO link to google docs
        const config = new DocumentBuilder()
            .setDescription(
                `"${configService.get(
                    'APPNAME',
                    'Project name'
                )}" - API documentation.<br><br>Link to <a  target='_blank' href='${apiGuideLink}'>API Guide</a>`
            )
            .setVersion('0.0.1')
            .addTag('Auth', 'Authentication APIs')
            .addTag('Public', 'Public APIs')
            .addServer('{schema}://to-be-established.com/', 'Staging API Server', {
                schema: { enum: ['http'], default: 'http' },
            })
            .addServer(`{schema}://localhost:${port}`, 'Local API Server', {
                schema: { enum: ['http'], default: 'http' },
            })
            .addServer(`{schema}://to-be-established.com`, 'Production API Server', {
                schema: { enum: ['https'], default: 'https' },
            })
            .addSecurity('X_API_KEY', {
                type: 'apiKey',
                name: 'X-API-Key',
                description: 'Application key',
                in: 'header',
            })
            .addSecurity('X_SESSION_KEY', {
                type: 'apiKey',
                name: 'X-Session-Key',
                description: 'Application key',
                in: 'header',
            })
            .build();
        const document = SwaggerModule.createDocument(app, config, {
            include: ApiModulesList,
        });
        SwaggerModule.setup(apiDoc, app, document);
    }

    await app.listen(port);

    logger.debug(`API Server started at http://localhost:${port}/${apiRoutePrefix}`);
    isSwaggerOn
        ? logger.debug(`Swagger Docs runs at http://localhost${port ? ':' + port : ''}/${apiDoc}`)
        : logger.debug('Swagger Docs is OFF');
};

bootstrap().catch(error => {
    logger.error(error);
});
