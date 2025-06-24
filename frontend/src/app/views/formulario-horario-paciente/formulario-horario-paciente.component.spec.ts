import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioHorarioPacienteComponent } from './formulario-horario-paciente.component';

describe('FormularioHorarioPacienteComponent', () => {
  let component: FormularioHorarioPacienteComponent;
  let fixture: ComponentFixture<FormularioHorarioPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioHorarioPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioHorarioPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
