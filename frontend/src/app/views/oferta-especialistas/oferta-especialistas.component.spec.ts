import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaEspecialistasComponent } from './oferta-especialistas.component';

describe('OfertaEspecialistasComponent', () => {
  let component: OfertaEspecialistasComponent;
  let fixture: ComponentFixture<OfertaEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaEspecialistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertaEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
