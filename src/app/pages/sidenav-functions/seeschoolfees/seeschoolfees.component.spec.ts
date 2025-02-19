import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeschoolfeesComponent } from './seeschoolfees.component';

describe('SeeschoolfeesComponent', () => {
  let component: SeeschoolfeesComponent;
  let fixture: ComponentFixture<SeeschoolfeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeschoolfeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeschoolfeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
