import { PagingModel } from '../Commons/PagingModel';

export interface sysUserFilter extends PagingModel {
  EmployeeId?: number;
  Username?: string;
  Name?: string;
  IsActive?: boolean;
  Gender?: number;
  fromDate?: Date;
  toDate?: Date;
  RoleId?: number;
  OrganizationId?: number;
}

export interface sysUserModel {
  Id?: number;
  EmployeeId?: number;
  Username?: string;
  Password?: string;
  RePassword?: string;
  Name?: string;
  Note?: string;
  Gender?: number;
  Email?: string;
  DateOfBirth?: any;
  StringOfBirth?: string;
  IsActive?: boolean;
  IsDeleted?: boolean;
  CreatedUserId?: number;
  CreatedDTG?: Date;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
  Version?: number;
  UserRoles?: sysUserRoleModel[];
}

export interface sysUserChangePassModel {
  Id?: number;
  Username?: string;
  OldPassword?: string;
  NewPassword?: string;
  ReNewPassword?: string;
}

export interface sysUserRoleModel {
  Id: number;
  UserId: number;
  RoleId?: number;
  RoleName: string;
}
