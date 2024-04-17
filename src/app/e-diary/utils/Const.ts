import {
  ClassAlignCSSTable,
  ClassCSSTable,
  Gender,
  NotificationType,
  Status,
  StatusDutyShift,
  TypeInput,
} from './Enum';

export class ESConst {
  static DefaultParams = ['@UserId', '@OrgIds', '@RoleIds'];

  static SqlOperators = [
    'And',
    'Or',
    'In',
    'Like',
    'Between',
    'Exist',
    '(',
    ')',
    '+',
    '-',
    '*',
    '/',
    '%',
    '=',
    '>',
    '<',
    '<>',
  ];

  static PatchParams = {
    id: 'id',
    refTypeId: 'refTypeId',
    keySearch: 'keySearch',
  };

  static LocalStorage = {
    Key: {
      Token: 'Token',
      AuthData: 'AuthData',
      DataMenu: 'DataMenu',
      ElementForm: 'elementForm',
      TableForm: 'tableForm',
    },
  };

  //#region Status
  static DicStatusDesc: Map<Status, string> = new Map([
    [Status.Open, 'Mới tạo'],
    [Status.Submitted, 'Chờ phê duyệt'],
    [Status.Approved, 'Phê duyệt'],
    [Status.Rejected, 'Từ chối'],
  ]);

  static DicStatusStyle: Map<Status, string> = new Map([
    [Status.Open, 'badge badge-pill bg-success text-white font-weight-normal'],
    [
      Status.Submitted,
      'badge badge-pill bg-warning text-dark font-weight-normal',
    ],
    [
      Status.Approved,
      'badge badge-pill bg-primary text-white font-weight-normal',
    ],
    [
      Status.Rejected,
      'badge badge-pill bg-danger text-white font-weight-normal',
    ],
  ]);

  static DicStatusStyleInput: Map<Status, string> = new Map([
    [Status.Open, 'bg-success text-white'],
    [Status.Submitted, 'bg-warning text-dark'],
    [Status.Approved, 'bg-primary text-white'],
    [Status.Rejected, 'bg-danger text-white'],
  ]);
  //#endregion

  //#region StatusDutyShift
  static DicStatusDesc_OnShiftDuty: Map<StatusDutyShift, string> = new Map([
    [StatusDutyShift.DangNhap, 'Đang nhập'],
    [StatusDutyShift.DaNhanCa, 'Chờ giao ca'],
    [StatusDutyShift.DaGiaoCa, 'Đã giao ca'],
    // [Status.Rejected, "Từ chối"],
  ]);
  static DicStatusStyle_OnShiftDuty: Map<StatusDutyShift, string> = new Map([
    [
      StatusDutyShift.DangNhap,
      'badge badge-pill bg-success text-white font-weight-normal',
    ],
    [
      StatusDutyShift.DaNhanCa,
      'badge badge-pill bg-warning text-dark font-weight-normal',
    ],
    [
      StatusDutyShift.DaGiaoCa,
      'badge badge-pill bg-primary text-white font-weight-normal',
    ],
  ]);

  static DicStatusStyleInput_OnShiftDuty: Map<StatusDutyShift, string> =
    new Map([
      [StatusDutyShift.DangNhap, 'bg-success text-white'],
      [StatusDutyShift.DaNhanCa, 'bg-warning text-dark'],
      [StatusDutyShift.DaGiaoCa, 'bg-primary text-white'],
    ]);
  //#endregion

  static DicGenderDesc: Map<Gender, string> = new Map([
    [Gender.Nam, 'Nam'],
    [Gender.Nu, 'Nữ'],
    [Gender.Khac, 'Khác'],
  ]);

  static TypeInputArray = [
    { value: TypeInput.TEXT, text: 'Text', type: 'input' },
    { value: TypeInput.NUMBER, text: 'Number', type: 'input' },
    { value: TypeInput.TEXTAREA, text: 'Textarea', type: 'textarea' },
    { value: TypeInput.DATE, text: 'Date (dd/mm/yyyy)', type: 'input' },
    { value: TypeInput.TIME_HH_MM, text: 'Time (HH:mm)', type: 'input' },
    { value: TypeInput.TIME_HH_MM_SS, text: 'Time (HH:mm:ss)', type: 'input' },
    {
      value: TypeInput.DATEPICKER,
      text: 'Date time(dd/mm/yyyy HH:mm)',
      type: 'input',
    },
    { value: TypeInput.SELECT, text: 'Select', type: 'input' },
    { value: TypeInput.CHECKBOX, text: 'Checkbox', type: 'input' },
  ];

  static ClassCSSTableMapping: Record<ClassCSSTable, string> = {
    [ClassCSSTable.Header]: 'Table Header(Giao diện cho bảng ở đầu trang)',
    [ClassCSSTable.Content]: 'Table Content(Giao diện cho bảng chứa nội dunng)',
    [ClassCSSTable.Footer]: 'Table Footer(Giao diện cho bảng ở cuối trang)',
  };

  static ClassAlignCSSTableMapping: Record<ClassAlignCSSTable, string> = {
    [ClassAlignCSSTable.left]: 'Căn trái',
    [ClassAlignCSSTable.center]: 'Căn giữa',
    [ClassAlignCSSTable.right]: 'Căn phải',
  };

  static NotificationTypeMapping: Record<NotificationType, string> = {
    [NotificationType.GiaoCa]: 'Giao ca',
    [NotificationType.NhanCa]: 'Nhận ca',
  };
}
