import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewrequirementComponent } from './newrequirement.component';

describe('NewrequirementComponent', () => {
  let component: NewrequirementComponent;
  let fixture: ComponentFixture<NewrequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewrequirementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewrequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
