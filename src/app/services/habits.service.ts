import { Injectable } from '@angular/core';
import { Habit } from '../models/habit.model';
import { HabitCheck } from '../models/habit_check.model';
import { SupabaseApiService } from './supabase-api.service';

@Injectable({
  providedIn: 'root'
})
export class HabitsService {
  private dateSelected: Date;
  constructor(public supabaseApi: SupabaseApiService) {
    this.dateSelected = new Date(Date.now());
  }

  getDateSelected() {
    return this.dateSelected;
  }

  setToday() {
    const now = new Date();
    let isToday = this.dateSelected.getFullYear() === now.getFullYear() && this.dateSelected.getMonth() === now.getMonth() && this.dateSelected.getDate() === now.getDate();
    this.dateSelected = now;
    return isToday;
  }

  incrementDate() {
    this.dateSelected.setDate(this.dateSelected.getDate() + 1);
  }

  decrementDate() {
    this.dateSelected.setDate(this.dateSelected.getDate() - 1);
  }

  isHabitChecked(habitId: string) {
    return this.supabaseApi.habits_checks.find(habitsCheck => {
      const date = new Date(habitsCheck.date);
      return habitsCheck.habit_id === habitId && date.getFullYear() === this.dateSelected.getFullYear() && date.getMonth() === this.dateSelected.getMonth() && date.getDate() === this.dateSelected.getDate();
    });
  }

  checkHabit(habitId: string) {
    let habitCheck = new HabitCheck();
    habitCheck.habit_id = habitId;
    habitCheck.date = this.dateSelected;
    habitCheck.user_id = this.supabaseApi.supabase.auth.session()?.user?.id!;
    this.supabaseApi.checkHabit(habitCheck);
    //this.supabaseApi.habits_checks.push(habitCheck);
  }

  uncheckHabit(habitId: string) {
    //let elementIndex!: number;
    const habitCheck = this.supabaseApi.habits_checks.find((habitsCheck, index) => {
      //elementIndex = index;
      const date = new Date(habitsCheck.date);
      return habitsCheck.habit_id === habitId && date.getFullYear() === this.dateSelected.getFullYear() && date.getMonth() === this.dateSelected.getMonth() && date.getDate() === this.dateSelected.getDate();
    });
    if (habitCheck) {
      this.supabaseApi.uncheckHabit(habitCheck.id);
      //this.supabaseApi.habits_checks.splice(elementIndex, 1);
    }
  }

  moveHabitUp(habit: Habit) {
    let movableHabit = habit;
    let preHabit = this.supabaseApi.habits$.value.find(hab => hab.order === movableHabit.order - 1);
    if (preHabit) {
      movableHabit.order--;
      preHabit.order++;
      this.supabaseApi.updateHabit(movableHabit);
      this.supabaseApi.updateHabit(preHabit);
    }
  }

  moveHabitDown(habit: Habit) {
    let movableHabit = habit;
    let afterHabit = this.supabaseApi.habits$.value.find(hab => hab.order === movableHabit.order + 1);
    if (afterHabit) {
      movableHabit.order++;
      afterHabit.order--;
      this.supabaseApi.updateHabit(movableHabit);
      this.supabaseApi.updateHabit(afterHabit);
    }
  }
}
