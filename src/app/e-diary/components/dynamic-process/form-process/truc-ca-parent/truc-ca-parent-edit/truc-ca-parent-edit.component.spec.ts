import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucCaParentEditComponent } from './truc-ca-parent-edit.component';

describe('TrucCaParentEditComponent', () => {
  let component: TrucCaParentEditComponent;
  let fixture: ComponentFixture<TrucCaParentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrucCaParentEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrucCaParentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
