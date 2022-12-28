import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsChecklistComponent } from './habits-checklist.component';

describe('HabitsChecklistComponent', () => {
  let component: HabitsChecklistComponent;
  let fixture: ComponentFixture<HabitsChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabitsChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
