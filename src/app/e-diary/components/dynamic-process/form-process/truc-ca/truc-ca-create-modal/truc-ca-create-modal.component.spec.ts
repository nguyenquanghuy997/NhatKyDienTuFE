import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucCaCreateModalComponent } from './truc-ca-create-modal.component';

describe('TrucCaCreateModalComponent', () => {
  let component: TrucCaCreateModalComponent;
  let fixture: ComponentFixture<TrucCaCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrucCaCreateModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrucCaCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
