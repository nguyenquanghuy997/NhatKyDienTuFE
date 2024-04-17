import { PagingModel } from '../Commons/PagingModel';
import { sysUserModel } from './sysUserModel';

export interface RoleModel {
  Id?: number;
  Name?: string;
  IsActive?: boolean;
  Note?: string;
  Version?: number;
  UserRoles?: sysUserModel[];
}

export interface RoleModelFilter extends PagingModel {
  Name?: string;
  IsActive?: boolean;
}


