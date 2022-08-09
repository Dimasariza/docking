import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiklatComponent } from './diklat.component';

describe('DiklatComponent', () => {
  let component: DiklatComponent;
  let fixture: ComponentFixture<DiklatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiklatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiklatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
