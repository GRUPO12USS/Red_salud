import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaEspecialistasComponent } from './agenda-especialistas.component';

describe('AgendaEspecialistasComponent', () => {
  let component: AgendaEspecialistasComponent;
  let fixture: ComponentFixture<AgendaEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaEspecialistasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
