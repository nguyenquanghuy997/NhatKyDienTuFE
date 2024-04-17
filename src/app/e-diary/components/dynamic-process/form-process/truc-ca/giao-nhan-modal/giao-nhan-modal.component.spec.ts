import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiaoNhanModalComponent } from './giao-nhan-modal.component';

describe('VerifyTotpComponent', () => {
  let component: GiaoNhanModalComponent;
  let fixture: ComponentFixture<GiaoNhanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiaoNhanModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiaoNhanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
