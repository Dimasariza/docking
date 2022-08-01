import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBateraComponent } from './report-batera.component';

describe('ReportBateraComponent', () => {
  let component: ReportBateraComponent;
  let fixture: ComponentFixture<ReportBateraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportBateraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBateraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
