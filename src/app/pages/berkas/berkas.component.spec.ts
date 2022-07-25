import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BerkasComponent } from './berkas.component';

describe('BerkasComponent', () => {
  let component: BerkasComponent;
  let fixture: ComponentFixture<BerkasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BerkasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BerkasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
