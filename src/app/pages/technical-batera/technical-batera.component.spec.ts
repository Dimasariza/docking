import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalBateraComponent } from './technical-batera.component';

describe('TechnicalBateraComponent', () => {
  let component: TechnicalBateraComponent;
  let fixture: ComponentFixture<TechnicalBateraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalBateraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalBateraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
