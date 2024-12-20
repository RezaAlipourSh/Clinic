import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLE_KEY } from "src/common/decorator/role.decorator";
import { UserRole } from "src/modules/user/enum/userRole.enum";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_KEY,
      [context.getClass(), context.getHandler()]
    );
    if (!requiredRoles || requiredRoles.length == 0) return true;
    const request: Request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (user.role === UserRole.Admin || user.role === UserRole.Owner)
      if (requiredRoles.includes(UserRole.Admin || UserRole.Owner)) return true;
    throw new ForbiddenException();
  }
}
