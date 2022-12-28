import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditHabitComponent } from './create-edit-habit.component';

describe('CreateEditHabitComponent', () => {
  let component: CreateEditHabitComponent;
  let fixture: ComponentFixture<CreateEditHabitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditHabitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
