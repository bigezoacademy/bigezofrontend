import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewschoolfeesComponent } from './newschoolfees.component';

describe('NewschoolfeesComponent', () => {
  let component: NewschoolfeesComponent;
  let fixture: ComponentFixture<NewschoolfeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewschoolfeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewschoolfeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
