import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles_check = this.reflector.get<string[]>(
      `roles`,
      context.getHandler(),
    );
    if (!roles_check) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { roles } = request.user;

    return this.matchRoles(roles, roles_check);
  }

  matchRoles(roles: string[], check: string[]): boolean {
    let out: boolean = false;
    roles.every(r => {
      if (check.indexOf(r) == -1) return true;
      out = true;
    });
    return out;
  }
}
