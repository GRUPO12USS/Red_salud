import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarHorarioDialogComponent } from './asignar-horario-dialog.component';

describe('AsignarHorarioDialogComponent', () => {
  let component: AsignarHorarioDialogComponent;
  let fixture: ComponentFixture<AsignarHorarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarHorarioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarHorarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
