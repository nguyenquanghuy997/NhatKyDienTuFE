import { sysUserModel } from './sysUserModel';
import { OrganizationUserModel } from './OrganizationUserModel';

export interface OrganizationModel {
  Id?: number;
  ParentId?: number;
  Type?: number;
  Name?: string;
  IsActive?: boolean;
  Note?: string;
  Version?: number;
  IsCollapse?: boolean;
  Children?: OrganizationModel[];
  checked?: false;
  expand?: false;
  IsGranted?: boolean;
  IsExistChildGranted?: boolean;
  OrganizationUsers?: OrganizationUserModel[];
  ParentName?: string;
  BreadcrumbName?: string;
  BreadcrumbId?: string;
  IsHighlighted?: boolean;
}

export interface OrganizationModelFilter {
  Name?: string;
  IsActive?: boolean;
  User_Name?: string;
  UserLogin?: string;
  Type?: number;
}
