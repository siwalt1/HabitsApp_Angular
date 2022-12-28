import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Habit } from '../models/habit.model';
import { HabitCheck } from '../models/habit_check.model';
import { Todo } from '../models/todo.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SupabaseApiService {
  supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
  todos$: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  habits$: BehaviorSubject<Habit[]> = new BehaviorSubject<Habit[]>([]);
  habits_checks: HabitCheck[] = [];

  habitsSubscription: any = undefined;
  habits_checksSubscription: any = undefined;

  constructor(private router: Router) {
    this.loadTodos();
    const todosSubscription = this.supabase.from<Todo>('todos').on('*', todos => { this.loadTodos() }).subscribe();

  }

  ngInit() {
    if (this.supabase.auth.session()) {
      this.initData();
      this.router.navigateByUrl('/')
    }
  }

  initData() {
    this.loadHabits();
    this.loadHabitsChecks();
    this.setUpSubscriptions();
  }

  async loadHabits() {
    console.log('loadHabits')
    const { data, error } = await this.supabase.from('habit').select();
    data?.sort((a, b) => a.order - b.order);
    this.habits$.next(<Habit[]>data);
  }

  async loadHabitsChecks() {
    console.log('loadHabitsChecks')
    const { data, error } = await this.supabase.from('habits_check').select();
    this.habits_checks = <HabitCheck[]>data;
  }

  async checkHabit(habitCheck: HabitCheck) {
    const { data, error } = await this.supabase.from<HabitCheck>('habits_check').insert(habitCheck);
    if (error) {
      console.log('error checkHabit(): ', error)
    }
  }

  async uncheckHabit(habitCheck_id: string) {
    const { data, error } = await this.supabase
      .from('habits_check')
      .delete()
      .match({ id: habitCheck_id })
    if (error) {
      console.log('error uncheckHabit(): ', error)
    }
  }

  async addHabit(habit: Habit) {
    habit.order = this.habits$?.getValue().length + 1;
    const { data, error } = await this.supabase.from<Habit>('habit').insert(habit);
    if (error) {
      console.log('error addHabit(): ', error)
    }
  }

  async updateHabit(habit: Habit) {
    const { data, error } = await this.supabase
      .from('habit')
      .update(habit)
      .match({ id: habit.id })
    if (error) {
      console.log('error updateHabit(): ', error)
    }
  }

  //todo
  async deleteHabit(habit: Habit) {
    /*const habits_checksToDelete = this.habits_checks.filter(habit_check => habit_check.habit_id === habit.id);
    habits_checksToDelete.forEach(async habit_check => {
      await this.supabase
        .from('habits_check')
        .delete()
        .match({ id: habit_check.id });
    });*/
    const { data, error } = await this.supabase
      .from('habit')
      .delete()
      .match({ id: habit.id })
    if (error) {
      console.log('error deleteHabit(): ', error)
    }
  }

  async login(email: string, password: string) {
    const { user, session, error } = await this.supabase.auth.signIn({
      email: email,
      password: password,
    })

    if (error) {
      alert(error.message)
    } else {
      this.initData();
      this.router.navigateByUrl('/')
    }
  }

  async register(email: string, password: string, firstname: string, lastname: string) {
    const { user, session, error } = await this.supabase.auth.signUp(
      {
        email: email,
        password: password,
      },
      {
        data: {
          first_name: firstname,
          last_name: lastname,
        }
      }
    )
    if (error) {
      alert('error beim registrieren: ' + error.message)
    } else {
      this.initData();
      this.router.navigateByUrl('/')
      alert('erfolgreich registriert')
    }
  }

  setUpSubscriptions() {
    this.habitsSubscription = this.supabase.from<Habit>('habit:user_id=eq.' + this.supabase.auth.session()?.user?.id)
      .on('INSERT', habit_payload => {
        console.log('habits: ', this.habits$)
        let newHabits = this.habits$.getValue();
        newHabits.push(habit_payload.new)
        this.habits$.next(newHabits);
        console.log('habits: ', this.habits$)
      })
      .on('UPDATE', habit_payload => {
        const habitIndex = this.habits$.getValue().findIndex(habit => habit.id == habit_payload.new.id);
        if (habitIndex != -1) {
          let newHabits = this.habits$.getValue();
          newHabits[habitIndex] = habit_payload.new;
          newHabits.sort((a, b) => a.order - b.order);
          this.habits$.next(newHabits);
        }
      })
      .on('DELETE', habit_payload => {
        let newHabits = this.habits$.getValue().filter(habit => habit.id != habit_payload.old.id);
        this.habits$.next(newHabits);
      })
      .subscribe();
    this.habits_checksSubscription = this.supabase.from<HabitCheck>('habits_check:user_id=eq.' + this.supabase.auth.session()?.user?.id)
      .on('INSERT', habits_checks_payload => {
        this.habits_checks.push(habits_checks_payload.new);
      })
      .on('DELETE', habits_checks_payload => {
        this.habits_checks = this.habits_checks.filter(habits_check => habits_check.id != habits_checks_payload.old.id);
      })
      .subscribe();
  }

  async logout() {
    //this.router.navigateByUrl('/login')
    const { error } = await this.supabase.auth.signOut()
    if (error) {
      alert('error beim logout' + error);
    } else {
      this.supabase.removeSubscription(this.habitsSubscription);
      this.supabase.removeSubscription(this.habits_checksSubscription);
      //this.habits$.next([]);
      //this.habits_checks = [];
    }
  }

  /*----*/
  async addTodo(todo: Todo) {
    console.log(todo)
    const { data, error } = await this.supabase.from<Todo>('todos').insert(todo);
  }

  async loadTodos() {
    const { data, error } = await this.supabase.from('todos').select();
    this.todos$.next(<Todo[]>data);
  }

  async deleteTodo(todoId: string) {
    const { data, error } = await this.supabase
      .from('todos')
      .delete()
      .match({ id: todoId })
  }
}
