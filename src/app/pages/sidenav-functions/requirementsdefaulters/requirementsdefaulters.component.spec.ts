import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsdefaultersComponent } from './requirementsdefaulters.component';

describe('RequirementsdefaultersComponent', () => {
  let component: RequirementsdefaultersComponent;
  let fixture: ComponentFixture<RequirementsdefaultersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementsdefaultersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementsdefaultersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
