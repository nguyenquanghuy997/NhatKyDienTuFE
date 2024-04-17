import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProcessDetailComponent } from './form-process-detail.component';

describe('FormProcessDetailComponent', () => {
  let component: FormProcessDetailComponent;
  let fixture: ComponentFixture<FormProcessDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProcessDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProcessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
