import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayschoolfeesComponent } from './payschoolfees.component';

describe('PayschoolfeesComponent', () => {
  let component: PayschoolfeesComponent;
  let fixture: ComponentFixture<PayschoolfeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayschoolfeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayschoolfeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
