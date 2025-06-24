import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaPacientesComponent } from './agenda-pacientes.component';

describe('AgendaPacientesComponent', () => {
  let component: AgendaPacientesComponent;
  let fixture: ComponentFixture<AgendaPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaPacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
