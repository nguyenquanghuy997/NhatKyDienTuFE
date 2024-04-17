import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { FileSystemItem } from 'src/app/e-diary/models/quan-tri/DirectoryNodeModel';
import { FileModel } from 'src/app/e-diary/models/quan-tri/FileModel';
import { DownloadFileServerService } from 'src/app/e-diary/services/quan-tri/download-file-server.service';

@Component({
  selector: 'app-directory-item',
  templateUrl: './directory-item.component.html',
  styleUrls: ['./directory-item.component.css'],
})
export class DirectoryItemComponent {
  @Input() item: FileSystemItem;
  @Input() level?: number = 1;
  @Output() onDowloadFile = new EventEmitter();
  @Input() isParentCollapsed: boolean;
  constructor(
    private downloadFileServerService: DownloadFileServerService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isParentCollapsed) {
      // this.item.IsCollapse = this.isParentCollapsed;
    }
  }

  onClickCollapse() {
    if (this.item.Children && this.item.Children.length > 0) {
      this.item.IsCollapse = !this.item.IsCollapse;
    }
  }

  downloadFileFromChild(file: FileModel) {
    this.downloadFileServerService.downloadFileOrZip(file).subscribe(
      (data: Blob) => {
        let fileName = file.Name;
        if (fileName.length > 0)
          fileName = fileName.replace(/[^\x00-\x7F]/g, '_');
        //phạm vi của bảng mã ASCII (từ ký tự có mã ASCII 0 đến ký tự có mã ASCII 127)
        // '_' Là giá trị mà các ký tự không thuộc bảng mã ASCII sẽ được thay thế bằng

        if (data.type === 'application/zip') {
          saveAs(data, fileName + '.zip');
        } else {
          const blob = new Blob([data], {
            type: 'application/zip, application/octet-stream',
          });
          saveAs(blob, fileName);
        }
      },
      (error) => {
        this.toastr.error(`Tải file/folder không thành công`, 'Lỗi');
      }
    );
  }
}
