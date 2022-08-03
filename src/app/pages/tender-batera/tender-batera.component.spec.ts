import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderBateraComponent } from './tender-batera.component';

describe('TenderBateraComponent', () => {
  let component: TenderBateraComponent;
  let fixture: ComponentFixture<TenderBateraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderBateraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderBateraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
