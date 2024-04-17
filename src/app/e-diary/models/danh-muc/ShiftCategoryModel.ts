import { PagingModel } from '../Commons/PagingModel';

export interface ShiftCategoryModel {
  Id?: number;
  Name?: string;
  OrganizationId?: number;
  OrganizationName?: string;
  Note?: string;
  IsActive?: boolean;
  Version?: number;
}

export interface ShiftCategoryFilter extends PagingModel {
  Name?: string;
  IsActive?: boolean;
}
