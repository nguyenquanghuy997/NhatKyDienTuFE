export interface EquipmentTagModel {
  Id?: number;
  EquipmentId?: number;
  EquipmentTagId?: number;
  TagId?: number;
  TagType?: number;
  UnitID?: number;
  PreText?: string;
  TagName?: string;
  TagCode?: string;
  UnitName?: string;
  EquipmentName?: string;
  EquipmentTagCode?: string;
  MinBlocking?: number;
  MaxBlocking?: number;
  MinWarning?: number;
  MaxWarning?: number;
  EquipmentCode?: string;

  SliderBlock?: [number, number] | [0, 0];
  SliderWarn?: [number, number] | [0, 0];
}
