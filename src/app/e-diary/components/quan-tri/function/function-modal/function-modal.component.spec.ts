import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionModalComponent } from './function-modal.component';

describe('FunctionModalComponent', () => {
  let component: FunctionModalComponent;
  let fixture: ComponentFixture<FunctionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunctionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
