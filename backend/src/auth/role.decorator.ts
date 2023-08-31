import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/entity/user.entity';

export type AllowedRole = keyof typeof UserRole | 'SuperAdmin_Admin' | 'Any';

export const Role = (role: AllowedRole[]) => SetMetadata('role', role);
