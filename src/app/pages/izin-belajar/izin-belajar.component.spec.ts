import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzinBelajarComponent } from './izin-belajar.component';

describe('IzinBelajarComponent', () => {
  let component: IzinBelajarComponent;
  let fixture: ComponentFixture<IzinBelajarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IzinBelajarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IzinBelajarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
