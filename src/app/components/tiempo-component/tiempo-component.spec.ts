import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiempoComponent } from './tiempo-component';

describe('TiempoComponent', () => {
  let component: TiempoComponent;
  let fixture: ComponentFixture<TiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiempoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TiempoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
