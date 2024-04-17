import { PagingModel } from '../Commons/PagingModel';
import { FeatureFunctionModel } from '../cau-hinh/FeatureFunctionModel';

export interface PermissionModel {
  Id?: number;
  FeatureFunctionId?: number;
  RoleId?: number;
  UserId?: number;
  IsGranted?: boolean;
  RuleId?: number;

  FunctionId?: number;
  FunctionCode?: string;
  FunctionName?: string;

  FeatureId?: number;
  FeatureParentId?: number;
  FeatureName?: number;
  FeatureCode?: number;

  RuleName?: number;
  RuleView?: number;
  RuleFormula?: number;

  RefTypeId?: number;

  Childs?: PermissionModel[];

  IsExistChildGranted?: boolean;

  IsCollapse: boolean;
}

export interface PermissionFilter {
  FeatureFunctionId?: number;
  RoleId?: number;
  UserId?: number;
  IsGranted?: boolean;
}

export interface PermissionGrant {
  Id?: number;
  RoleId?: number;
  UserId?: number;
  RuleId?: number;
  IsGranted?: boolean;
  FeatureFunctions?: FeatureFunctionModel[];
  Permissions?: PermissionModel[];
}
