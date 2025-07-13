import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nombre } from './nombre';

describe('Nombre', () => {
  let component: Nombre;
  let fixture: ComponentFixture<Nombre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nombre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nombre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
