import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PagingModel } from '../../../models/Commons/PagingModel';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() pageIndex: number = 1;
  @Input() totalItem: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageCount: number[] = [];
  @Output() onChangePagination = new EventEmitter();

  changePagination(pageIndex: number) {
    this.pageIndex = pageIndex;
    let pagingConfig: PagingModel = { PageIndex : this.pageIndex, PageSize: this.pageSize }
    this.onChangePagination.emit(pagingConfig);
  }

  changePageSize() {
    this.pageIndex = 1;
    let pagingConfig: PagingModel = { PageIndex : this.pageIndex, PageSize: this.pageSize }
    this.onChangePagination.emit(pagingConfig);
  }
}
