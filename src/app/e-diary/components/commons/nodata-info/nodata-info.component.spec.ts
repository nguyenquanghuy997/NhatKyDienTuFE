import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodataInfoComponent } from './nodata-info.component';

describe('NodataInfoComponent', () => {
  let component: NodataInfoComponent;
  let fixture: ComponentFixture<NodataInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodataInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodataInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
