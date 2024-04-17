import { Component, EventEmitter, Output } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileModel } from 'src/app/e-diary/models/quan-tri/FileModel';
import { DownloadFileServerService } from 'src/app/e-diary/services/quan-tri/download-file-server.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FileSystemItem } from 'src/app/e-diary/models/quan-tri/DirectoryNodeModel';
import { ResponseModel } from 'src/app/e-diary/models/Commons/ResponseModel';
import { CommonService } from 'src/app/e-diary/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-download-log',
  templateUrl: './download-log.component.html',
  styleUrls: ['./download-log.component.css'],
})
export class DownloadLogComponent {
  rootItem: FileSystemItem;
  isCollapsed = true;
  isParentCollapsed: boolean = false;
  isChildVisible: boolean = true;
  loading: boolean = false;
  searchText: string = '';
  searchActivated: boolean = false;
  constructor(
    private downloadFileServerService: DownloadFileServerService,
    private route: ActivatedRoute,
    private title: Title,
    private commonService: CommonService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.title.setTitle(this.route.snapshot.data.title);
    this.getDirectoryTree();
  }

  getDirectoryTree(): void {
    this.loading = true;
    this.downloadFileServerService.getDirectoryTree().subscribe(
      (result: ResponseModel) => {
        if (this.commonService.checkTypeResponseData(result)) {
          this.rootItem = result.Data;
        } else {
          this.toastr.error(`${result.Message}`, 'Lỗi');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
  toggleCollapse() {
    this.isParentCollapsed = !this.isParentCollapsed;
    this.isChildVisible = !this.isChildVisible;
  }

  downloadAllFile(file: FileModel): void {
    this.downloadFileServerService.downloadFileOrZip(file).subscribe(
      (data: Blob) => {
        let fileName = file.Name;
        if (fileName.length > 0)
          fileName = fileName.replace(/[^\x00-\x7F]/g, '_');

        if (data.type === 'application/zip') {
          saveAs(data, fileName + '.zip');
        } else {
          const blob = new Blob([data], {
            type: 'application/zip, application/octet-stream',
          });
          saveAs(blob, fileName);
        }
      },
      (error) => {}
    );
  }

  setSearchText(text: string) {
    this.searchText = text;
  }

  reLoadPage() {
    this.setSearchText('');
    this.getDirectoryTree();
  }
  // onSearch(): void {
  //   var keySearch = (document.getElementById('keySearch') as HTMLInputElement)
  //     .value;
  //   this.searchText = keySearch;
  //   console.log('this.searchText: ', this.searchText);
  //   this.searchActivated = true;
  // }
}
