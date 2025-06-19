import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudBoxesComponent } from './crud-boxes.component';

describe('CrudBoxesComponent', () => {
  let component: CrudBoxesComponent;
  let fixture: ComponentFixture<CrudBoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudBoxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
