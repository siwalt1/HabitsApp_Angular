import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Habit } from 'src/app/models/habit.model';
import { HabitsService } from 'src/app/services/habits.service';
import { SupabaseApiService } from 'src/app/services/supabase-api.service';
import { CreateEditHabitComponent } from '../create-edit-habit/create-edit-habit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-habits-checklist',
  templateUrl: './habits-checklist.component.html',
  styleUrls: ['./habits-checklist.component.scss']
})
export class HabitsChecklistComponent implements OnInit {
  animationLeft: boolean = false;
  animationRight: boolean = false;
  editHabits: boolean = false;
  constructor(public dialog: MatDialog, public habitsService: HabitsService, public supabaseApi: SupabaseApiService, private router: Router) {
  }

  ngOnInit(): void {
    this.supabaseApi.initData();
  }

  getDateString() {
    return this.habitsService.getDateSelected().getDate().toString() + '. ' + this.habitsService.getDateSelected().toLocaleString('default', { month: 'long' }) + ' ' + this.habitsService.getDateSelected().getFullYear().toString();
  }

  navigateToday() {
    const oldDateValue = this.habitsService.getDateSelected();
    if (!this.habitsService.setToday()) {
      if (oldDateValue.getTime() < Date.now()) {
        this.animationRight = true;
      } else {
        this.animationLeft = true;
      }
      setTimeout(() => {
        this.animationLeft = false;
        this.animationRight = false;
      }, 500);
    }

  }

  navigateBack() {
    this.habitsService.decrementDate();
    this.animationLeft = true;
    setTimeout(() => {
      this.animationLeft = false;
    }, 500);
  }

  navigateForward() {
    this.habitsService.incrementDate();
    this.animationRight = true;
    setTimeout(() => {
      this.animationRight = false;
    }, 500);
  }

  toggleEditHabits() {
    this.editHabits = !this.editHabits;
  }

  moveHabitUp(habit: Habit) {
    this.habitsService.moveHabitUp(habit);
  }

  moveHabitDown(habit: Habit) {
    this.habitsService.moveHabitDown(habit);
  }

  createHabit() {
    const dialogRef = this.dialog.open(CreateEditHabitComponent, {
    });
  }

  editHabit(habit: Habit) {
    const dialogRef = this.dialog.open(CreateEditHabitComponent, {
      data: { ...habit },
    });
  }

  isHabitChecked(habitId: string) {
    return this.habitsService.isHabitChecked(habitId);
  }

  checkHabit(habitId: string) {
    this.habitsService.checkHabit(habitId);
  }

  uncheckHabit(habitId: string) {
    this.habitsService.uncheckHabit(habitId);
  }
}
