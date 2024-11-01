import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "src/common/decorator/skip-auth.decorator";
import { Request } from "express";
import { isJWT } from "class-validator";
import { ClinicService } from "../clinic.service";

@Injectable()
export class ClinicGuard implements CanActivate {
  constructor(
    private clinicService: ClinicService,
    private reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext) {
    const isSkippedAuth = this.reflector.get<boolean>(
      SKIP_AUTH,
      context.getHandler()
    );
    if (isSkippedAuth) return true;
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);
    request.user = await this.clinicService.validateAccessToken(token);
    return true;
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization?.trim() == "") {
      throw new UnauthorizedException("Login on your account");
    }
    const [bearer, token] = authorization?.split(" ");
    if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token))
      throw new UnauthorizedException("Login On Your Account");
    return token;
  }
}
