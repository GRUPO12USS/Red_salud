import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxFormDialogComponent } from './box-form-dialog.component';

describe('BoxFormDialogComponent', () => {
  let component: BoxFormDialogComponent;
  let fixture: ComponentFixture<BoxFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
