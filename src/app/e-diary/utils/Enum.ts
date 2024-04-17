export enum FunctionCode {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  DISPLAY = 'DISPLAY',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  SUBMIT = 'SUBMIT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  GiaoNhanCa = 'GiaoNhanCa',
  VIEWSECRET = 'VIEWSECRET',
}

export enum ResponseTypeES {
  Success = 1,
  Warning = 2,
  Error = 3,
  ConnectionError = 4,
  LoginRequired = 5,
}

export enum Status {
  Open = 1,
  Submitted = 2,
  Approved = 3,
  Rejected = 4,
}

export enum StatusDutyShift {
  DangNhap = 1,
  DaNhanCa = 2,
  DaGiaoCa = 3,
}

export enum TypeInput {
  TEXT = 'Text',
  NUMBER = 'number',
  TEXTAREA = 'Textarea',
  DATE = 'date',
  DATEPICKER = 'dateTime',
  TIME_HH_MM = 'time_hm',
  TIME_HH_MM_SS = 'time_hms',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
}

export const TypeInputDescription = {
  [TypeInput.TEXT]: '',
  [TypeInput.NUMBER]: 'Nhập số',
  [TypeInput.TEXTAREA]: '',
  [TypeInput.DATE]: 'dd/mm/yyyy',
  [TypeInput.DATEPICKER]: 'dd/mm/yyyy HH:mm',
  [TypeInput.TIME_HH_MM]: 'HH:mm',
  [TypeInput.TIME_HH_MM_SS]: 'HH:mm:ss',
  [TypeInput.SELECT]: 'Chọn giá trị',
  [TypeInput.CHECKBOX]: '',
};

export enum cleaveInputClass {
  TEXT = 'input-text',
  NUMBER = 'input-number',
  DATE = 'input-date',
  DATEPICKER = 'input-date-hms',
  TIME_HH_MM = 'input-time-hm',
  TIME_HH_MM_SS = 'input-time-hms',
}

export enum NotificationType {
  NhanCa = 1,
  GiaoCa = 2,
}

export enum ConfigCode {
  TotpLenght = 'TotpLenght',
  TotpPeriod = 'TotpPeriod',
  DefaultPassword = 'DefaultPassword',
  SmovApiBcsxDownloadTemp = 'SmovApiBcsxDownloadTemp',
  SmovApiBcsxUploadFile = 'SmovApiBcsxUploadFile',
}

export enum ClassCSSTable {
  Header = 'tableHeader',
  Content = 'tableContent',
  Footer = 'tableFooter',
}
export enum ClassAlignCSSTable {
  left = 'text-left',
  center = 'text-center',
  right = 'text-right',
}

export enum ConstantLoaiHinhNMD {
  ThuyDien = 1,
  NhietDienThan = 2,
  NhietDienChayDau = 3,
  NhietDienChayKhi = 5,
  NhietDienTuabinKhiHonHop = 6,
  NhietDienSinhKhoi = 7,
  PhongDien = 8,
  NangLuongMatTroi = 9,
  Khac = 99,
}
export enum NgSelectMessage {
  NotFound = 'Không tìm thấy dữ liệu',
}
export enum TypeOrg {
  CongTy = 1,
  NhaMay = 2,
  Phong = 3,
}
export const TypeOrgDescription = {
  [TypeOrg.CongTy]: 'Công ty',
  [TypeOrg.NhaMay]: 'Nhà máy',
  [TypeOrg.Phong]: 'Phòng',
};

export enum Gender{
  Nam = 1,
  Nu = 2,
  Khac = 3,
}
