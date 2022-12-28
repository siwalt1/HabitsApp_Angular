import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';
import { SupabaseApiService } from 'src/app/services/supabase-api.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  todo: Todo;
  actionLabel: string;

  constructor(public supabaseApi: SupabaseApiService) {
    this.todo = new Todo();
    this.actionLabel = 'ADD';
  }

  ngOnInit(): void {
  }

  addTodo() {
    this.supabaseApi.addTodo(this.todo)
    this.todo = new Todo();
  }

  deleteTodo(todoId: string){
    this.supabaseApi.deleteTodo(todoId);
  }
}
