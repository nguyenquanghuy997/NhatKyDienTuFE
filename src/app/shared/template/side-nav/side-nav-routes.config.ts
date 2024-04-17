import { SideNavInterface } from '../../interfaces/side-nav.type';

// JSON này để thay cho dữ liệu cấu hình trong CSDL
// Nếu đã có Api lấy Menu rồi thì không cần dùng đến dữ liệu JSON này
export const ROUTES: SideNavInterface[] = [
  {
    path: 'e-diary/trang-chu',
    title: 'Trang chủ',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'dashboard',
    submenu: [
      {
        path: 'e-diary/trang-chu',
        title: 'Trang chủ',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu: [],
      },
    ],
  },

  {
    path: '',
    title: 'Quản trị',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'user',
    submenu: [
      {
        path: 'e-diary/nguoi-dung',
        title: 'Người dùng',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: [],
      },

      {
        path: 'e-diary/nhan-vien',
        title: 'Nhân viên',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: [],
      },

      {
        path: 'e-diary/chuc-nang',
        title: 'Chức năng',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: [],
      },

      {
        path: 'e-diary/phan-quyen',
        title: 'Phân quyền',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: [],
      },
    ],
  },

  {
    path: '',
    title: 'Danh mục',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'unordered-list',
    submenu: [
      {
        path: 'e-diary/don-vi-tinh',
        title: 'Đơn vị tính',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: [],
      },
      {
        path: 'e-diary/thong-so',
        title: 'Thông số',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: [],
      },
    ],
  },

  {
    path: '',
    title: 'Cấu hình',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'setting',
    submenu: [
      // {
      //   path: 'e-diary/cau-hinh-bieu-mau',
      //   title: 'Kéo thả biểu mẫu',
      //   iconType: '',
      //   icon: '',
      //   iconTheme: '',
      //   submenu: [],
      // },
      {
        path: 'e-diary/cau-hinh/reftype',
        title: 'Nghiệp vụ',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: [],
      },
      {
        path: 'e-diary/form-mau',
        title: 'Biểu mẫu',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: [],
      },
    ],
  },

  {
    path: '',
    title: 'Nhật ký vận hành',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'database',
    submenu: [
      // {
      //   path: 'e-diary/truc-phu',
      //   title: 'Nhật ký trực phụ',
      //   iconType: 'nzIcon',
      //   icon: '',
      //   iconTheme: 'outline',
      //   submenu: [],
      // },
      {
        path: 'e-diary/truc-ca/1',
        title: 'Nhật ký trưởng ca',
        iconType: 'nzIcon',
        icon: '',
        iconTheme: 'outline',
        submenu: [],
      },
      {
        path: 'e-diary/truc-ca/2',
        title: 'Nhật ký trực chính',
        iconType: 'nzIcon',
        icon: '',
        iconTheme: 'outline',
        submenu: [],
      },
      {
        path: 'e-diary/truc-ca/3',
        title: 'Nhật ký trực phụ',
        iconType: 'nzIcon',
        icon: '',
        iconTheme: 'outline',
        submenu: [],
      },
      {
        path: 'e-diary/truc-ca/4',
        title: 'Thông số thủy văn',
        iconType: 'nzIcon',
        icon: '',
        iconTheme: 'outline',
        submenu: [],
      },
      {
        path: 'e-diary/truc-ca/5',
        title: 'Thông số tủ Instrument',
        iconType: 'nzIcon',
        icon: '',
        iconTheme: 'outline',
        submenu: [],
      },
    ],
  },
];
