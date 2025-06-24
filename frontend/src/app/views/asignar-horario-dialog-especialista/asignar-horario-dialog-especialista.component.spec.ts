import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarHorarioDialogEspecialistaComponent } from './asignar-horario-dialog-especialista.component';

describe('AsignarHorarioDialogEspecialistaComponent', () => {
  let component: AsignarHorarioDialogEspecialistaComponent;
  let fixture: ComponentFixture<AsignarHorarioDialogEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarHorarioDialogEspecialistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarHorarioDialogEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
