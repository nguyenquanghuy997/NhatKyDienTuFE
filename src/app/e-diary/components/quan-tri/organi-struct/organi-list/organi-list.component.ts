import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrganizationModel } from 'src/app/e-diary/models/quan-tri/OrganizationModel';

@Component({
  selector: 'app-organi-list',
  templateUrl: './organi-list.component.html',
  styleUrls: ['./organi-list.component.scss'],
})
export class OrganiListComponent {
  @Input() model: OrganizationModel;
  @Input() parentModel: OrganizationModel;
  @Input() level?: number = 1;
  @Input() isExpanded: boolean = false;
  @Output() onSetCheckboxForParent = new EventEmitter();
  @Output() onShowModalRule = new EventEmitter();
  @Output() onSetItemDetail = new EventEmitter();
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  isClicked = false;
  constructor(
    public toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit() {}

  onClickCollapse(isCollapse: boolean) {
    this.model.IsCollapse = isCollapse;
  }

  onGetItemDetail(item: OrganizationModel) {
    this.onSetItemDetail.emit(item);
  }

  isLinkClicked() {
    this.isClicked = true;
  }
}
