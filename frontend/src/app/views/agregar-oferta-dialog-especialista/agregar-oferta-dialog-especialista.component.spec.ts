import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarOfertaDialogEspecialistaComponent } from './agregar-oferta-dialog-especialista.component';

describe('AgregarOfertaDialogEspecialistaComponent', () => {
  let component: AgregarOfertaDialogEspecialistaComponent;
  let fixture: ComponentFixture<AgregarOfertaDialogEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarOfertaDialogEspecialistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarOfertaDialogEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
