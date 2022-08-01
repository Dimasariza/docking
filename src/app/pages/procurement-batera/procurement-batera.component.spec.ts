import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementBateraComponent } from './procurement-batera.component';

describe('ProcurementBateraComponent', () => {
  let component: ProcurementBateraComponent;
  let fixture: ComponentFixture<ProcurementBateraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurementBateraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementBateraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
