import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '@utils/enums';

export const Roles = (...roles: RoleEnum[]) => SetMetadata(`roles`, roles);
