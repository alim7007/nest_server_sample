import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppleAuthGuard extends AuthGuard('apple-auth') { }