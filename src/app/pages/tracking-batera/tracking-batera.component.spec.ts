import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingBateraComponent } from './tracking-batera.component';

describe('TrackingBateraComponent', () => {
  let component: TrackingBateraComponent;
  let fixture: ComponentFixture<TrackingBateraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingBateraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingBateraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
