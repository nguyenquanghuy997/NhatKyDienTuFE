import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReftypeModalComponent } from './reftype-modal.component';

describe('ReftypeModalComponent', () => {
  let component: ReftypeModalComponent;
  let fixture: ComponentFixture<ReftypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReftypeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReftypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
