import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucCaParentAddnewModalComponent } from './truc-ca-parent-addnew-modal.component';

describe('TrucCaParentAddnewModalComponent', () => {
  let component: TrucCaParentAddnewModalComponent;
  let fixture: ComponentFixture<TrucCaParentAddnewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrucCaParentAddnewModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrucCaParentAddnewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
