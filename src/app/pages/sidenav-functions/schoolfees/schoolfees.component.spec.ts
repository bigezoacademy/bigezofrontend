import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolfeesComponent } from './schoolfees.component';

describe('SchoolfeesComponent', () => {
  let component: SchoolfeesComponent;
  let fixture: ComponentFixture<SchoolfeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolfeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolfeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
