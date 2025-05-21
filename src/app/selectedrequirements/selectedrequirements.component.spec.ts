import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedrequirementsComponent } from './selectedrequirements.component';

describe('SelectedrequirementsComponent', () => {
  let component: SelectedrequirementsComponent;
  let fixture: ComponentFixture<SelectedrequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedrequirementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedrequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
