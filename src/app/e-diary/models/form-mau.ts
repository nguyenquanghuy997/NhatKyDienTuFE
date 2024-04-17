export interface formMauModelFilter {
  Name?: string;
  IsActive?: boolean;
  PageIndex: number;
  PageSize: number;
  TotalRecords?: number;
  PageCount?: number;
}

export interface formMauModel {
  Id: number;
  Name?: string;
  Context?: string;
  Note?: string;
  IsActive: boolean;
  IsDeleted: boolean;
  CreatedUserId: number;
  CreatedDTG: Date;
  UpdatedUserId?: number;
  UpdatedDTG?: Date;
  Version: number;
}
