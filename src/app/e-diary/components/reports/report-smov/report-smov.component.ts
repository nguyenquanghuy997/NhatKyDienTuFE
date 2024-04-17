import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { ReportService } from 'src/app/e-diary/services/reports/report.service';
import { Utility } from 'src/app/e-diary/utils/Utility';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FileDownloadModel } from 'src/app/e-diary/models/Reports/FileDownloadModel';
import * as XLSX from 'xlsx'
import moment from 'moment';
import { ESDateHelper } from 'src/app/e-diary/utils/Helper';
import { ConstantLoaiHinhNMD } from 'src/app/e-diary/utils/Enum';
import { CommonService } from 'src/app/e-diary/services/common.service';

@Component({
  selector: 'app-report-smov',
  templateUrl: './report-smov.component.html',
  styleUrls: ['./report-smov.component.css']
})

export class ReportSmovComponent {
  loading = false;
  datePickerConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  maxDate: Date;

  reportDate: Date;
  current_file_data: any;

  form!: FormGroup;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private router: Router,
    // private route: ActivatedRoute,
    private reportService: ReportService,
    private toastr: ToastrService,
    private commonService: CommonService,
  ) {
    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.reportDate = new Date();
    this.reportDate.setDate(this.reportDate.getDate() - 1);
    this.datePickerConfig = {
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      isAnimated: true,
      showClearButton: true,
    };

    this.form = new FormGroup({
      ReportDate: new FormControl(this.reportDate),
    });
  }

  onDownloadTempFile() {
    let date = new Date(this.reportDate.getTime());
    if (date instanceof Date) {
      let startTimezoneOffset = date.getTimezoneOffset();
      date.setMinutes(date.getMinutes() - startTimezoneOffset);
    } else {
      console.error(`Ngày vận hành không phải Date: ${date}`);
    }
    this.loading = true;
    this.reportService.downloadTempBcsxSmov(date.toJSON()).subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          let fileInfo: FileDownloadModel = res.Data;

          // Convert the Base64-encoded string to a byte array
          const byteString = window.atob(fileInfo.FileBytes);
          const byteArray = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) {
            byteArray[i] = byteString.charCodeAt(i);
          }

          // save file
          let file = new Blob([byteArray], { type: fileInfo.ContentType });
          saveAs(file, fileInfo.FileName);
        } else {
          console.error(res.Exception);
          this.toastr.error(`${res.Message}`, 'Lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  onUploadFile() {
    $("#uploadFile").click();
  }

  onChooseFile(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.loading = true;
      let file = fileList[0];

      // tạo trình reader để read file
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        // đọc file và gửi lên SMOV luôn
        this.readFile(file, e)

        // call API push SMOV
        this.submitBcsxSmov();

        // Đặt giá trị của input file về rỗng
        this.fileInput.nativeElement.value = '';

      };

      reader.onerror = (ex) => {
        console.error(ex);
      };

      reader.readAsBinaryString(file);

    }
  }

  submitBcsxSmov() {
    this.reportService.submitBcsxSmov(this.current_file_data).subscribe(
      (res: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(res)) {
          this.toastr.success('Gửi báo cáo thành công!', 'Thành công');
        } else {
          console.error(res);
          this.toastr.error(`${res.Message}`, 'Lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  readFile(file: File, e: any) {
    try {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const sheet: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
      const sheet2: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[1]];

      var id_col_index = 21, start_tm_col_index = 1;

      // kiểm tra file người dùng sử dụng có phải file mới nhất không
      {
        var loaiHinh = this.getCellValue(sheet, id_col_index, 3);
        if (loaiHinh == ConstantLoaiHinhNMD.NhietDienChayDau) {
          let checkFileMessage = "File mẫu bạn sử dụng đã cũ và không còn sử dụng được tiếp, vui lòng tải file mẫu mới!";
          let checkSuDungDauDo = this.getCellValue(sheet, id_col_index + 1, 1);
          if (checkSuDungDauDo == null || checkSuDungDauDo == undefined) {
            throw Error(checkFileMessage);
          }
        }
      }

      // Đọc các thông tin chung
      var file_data: any = {
        NgayFormat: 'yyyy-MM-dd',
        IdNhaMay: parseInt(this.getCellValue(sheet, id_col_index, 0)),
        TenNhaMay: this.getCellValue(sheet, 0, 0),
        //NgayVanHanh: this.getCellValue(sheet, id_col_index, start_tm_col_index),
        NgayVanHanh: ESDateHelper.toDateString(this.reportDate),
        SoLuongChuKy: parseInt(this.getCellValue(sheet, id_col_index, 2)),
        LoaiHinhNM: this.getCellValue(sheet, id_col_index, 3),
        Data: [],
        SanLuong: [],
        ThongTinThuyVans: [],

        // Date: Date = null,
        // SuDungDauDo: Boolean = null,
        // SuDungDauFo: Boolean = null,
      };

      file_data.Date = new Date(moment(file_data.NgayVanHanh, 'YYYY-MM-DD').toDate());

      if (isNaN(file_data.SoLuongChuKy) || file_data.SoLuongChuKy % 24 != 0)
        throw Error('Giá trị số lượng chu kỳ không hợp lệ' + (isNaN(file_data.SoLuongChuKy) ? "" : ": " + file_data.SoLuongChuKy));

      if (isNaN(file_data.IdNhaMay))
        throw Error('Không tìm thấy nhà máy hợp lệ!');

      if (isNaN(file_data.LoaiHinhNM))
        throw Error('Không tìm thấy thông tin loại hình nhà máy!')

      // Nếu là nhà máy chạy dầu thì sẽ có thêm option để chọn loại dầu khi hiển thị
      let suDungDauDo = false, suDungDauFo = false;

      if (file_data.LoaiHinhNM == ConstantLoaiHinhNMD.NhietDienChayDau) {
        // $(this.params.filter_fuel).show();
        suDungDauDo = Utility.isTrue(this.getCellValue(sheet, id_col_index + 1, 1));
        suDungDauFo = Utility.isTrue(this.getCellValue(sheet, id_col_index + 1, 2));
      }
      else {
        // $(this.params.filter_fuel).hide();
      }

      file_data.SuDungDauDo = suDungDauDo;
      file_data.SuDungDauFo = suDungDauFo;

      var start_row = 9;

      // Cột cuối cùng có dữ liệu của file
      var endCol = this.getFileEndCol(start_row - 1, sheet);

      // Đọc thông số theo chu kỳ
      file_data.Data = this.get_cacThongSoChuKy(sheet, start_row, endCol, file_data.SoLuongChuKy);

      // Đối với các nhà máy nhiệt điện sử dụng dầu: kiểm tra số lượng nhiên liệu mà nhà máy đang sử dụng
      const soSheetNhienLieu = parseInt(this.getCellValue(sheet, id_col_index + 1, 0));
      if (file_data.LoaiHinhNM == ConstantLoaiHinhNMD.NhietDienChayDau && soSheetNhienLieu == 2) {
        file_data.Data = file_data.Data.concat(this.get_cacThongSoChuKy(sheet2, start_row, endCol, file_data.SoLuongChuKy));
      }

      // Số dòng chứa sản lượng
      let soDongSanLuong = this.get_SoDongChuaDuLieuSanLuong(start_row + file_data.SoLuongChuKy + 2, sheet);

      // Đọc các thông số sản lượng
      file_data.SanLuong = this.get_cacThongSoSanLuong(sheet, start_row + file_data.SoLuongChuKy + 2, soDongSanLuong);

      if (file_data.LoaiHinhNM == ConstantLoaiHinhNMD.NhietDienChayDau && soSheetNhienLieu == 2) {
        file_data.SanLuong = file_data.SanLuong.concat(this.get_cacThongSoSanLuong(sheet2, start_row + file_data.SoLuongChuKy + 2, soDongSanLuong));
      }

      if (file_data.LoaiHinhNM == ConstantLoaiHinhNMD.ThuyDien) {

        let soHoChua = parseInt(this.getCellValue(sheet, id_col_index, 4));

        if (isNaN(soHoChua))
          throw Error('Số hồ chứa không hợp lệ!');

        for (let i = 0; i < soHoChua; i++) {
          file_data.ThongTinThuyVans.push({
            IdHoChua: this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 3 + soDongSanLuong),
            TenHoChua: this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 4 + soDongSanLuong),
            MucNuocThuongLuu: this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 5 + soDongSanLuong) == null ? null : this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 5 + soDongSanLuong).replace(/,/g, ''),
            MucNuocHaLuu: this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 6 + soDongSanLuong) == null ? null : this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 6 + soDongSanLuong).replace(/,/g, ''),
            LuuLuongVe: this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 7 + soDongSanLuong) == null ? null : this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 7 + soDongSanLuong).replace(/,/g, ''),
            LuuLuongChaymay: this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 8 + soDongSanLuong) == null ? null : this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 8 + soDongSanLuong).replace(/,/g, ''),
            LuuLuongXa: this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 9 + soDongSanLuong) == null ? null : this.getCellValue(sheet, i + 2, start_row + file_data.SoLuongChuKy + 9 + soDongSanLuong).replace(/,/g, ''),
          });
        }
      }

      this.current_file_data = file_data;
    } catch (ex) {
      console.error(ex);
      this.toastr.error(ex);
    }
  }

  getCellValue(sheet: XLSX.WorkSheet, col: number, row: number) {
    var cell_ref = XLSX.utils.encode_cell({ c: col, r: row });
    return sheet[cell_ref] ? sheet[cell_ref].w : null;
  }

  getFileEndCol(row, sheet) {
    let count = 0;
    while (true) {
      let val = this.getCellValue(sheet, count, row);
      if (val == null) {
        return count - 1;
      }
      count++;
    }
  }

  get_cacThongSoChuKy(sheet: XLSX.WorkSheet, startRow: number, endCol: number, soLuongChuKy: number): any[] {
    let result = [];
    for (let chuky = 1; chuky <= soLuongChuKy; chuky++) {
      let thongSoTrongChuKys = [];
      for (let i = 1; i <= endCol; i++) {
        var giaTri = this.getCellValue(sheet, i, startRow + chuky) == null ? null : this.getCellValue(sheet, i, startRow + chuky).replace(/,/g, '');
        thongSoTrongChuKys.push(giaTri);
      }
      result.push(thongSoTrongChuKys);
    }
    return result;
  }

  get_cacThongSoSanLuong(sheet: XLSX.WorkSheet, row: number, soDongSanLuong: number): any[] {
    let result = [];
    for (let i = 0; i < soDongSanLuong; i++)
      result.push(this.getCellValue(sheet, 2, row + i) == null ? null : this.getCellValue(sheet, 2, row + i).replace(/,/g, ''));
    return result;
  }

  get_SoDongChuaDuLieuSanLuong(row: number, sheet: XLSX.WorkSheet) {
    let count = 0;
    while (true) {
      let val = this.getCellValue(sheet, 0, row + count);
      if (val == null)
        return count;
      count++;
    }
  }

}
