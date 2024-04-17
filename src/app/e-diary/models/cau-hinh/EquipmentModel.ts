import { PagingModel } from '../Commons/PagingModel';
import { EquipmentTagModel } from './EquipmentTagModel';

export interface EquipmentModel {
  Id?: number;
  ParentId?: number;
  Type?: number;
  Name?: string;
  Code?: string;
  Note?: string;
  Content?: string;
  IsActive?: boolean;
  IsDeleted?: boolean;
  CreatedUserId?: number;
  CreatedDTG?: Date;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
  Version?: number;
  EquipmentTags?: EquipmentTagModel[];

  BreadcrumbId?: string;
  BreadcrumbCode?: string;
  BreadcrumbName?: string;
  OrganizationId?: number;
  OrganizationBreadcrumbName?: string;
}
export interface EquipmentModelFilter extends PagingModel {
  Name?: string;
  Code?: number;
  IsActive?: boolean;
  KeySearch?: string;
  OrganizationId?: number;
  EquipementIds?: number[];
}
