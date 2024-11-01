import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/modules/user/enum/userRole.enum";

export const ROLE_KEY = "ROLES";
export const CanAccess = (...roles: UserRole[]) => SetMetadata(ROLE_KEY, roles);
