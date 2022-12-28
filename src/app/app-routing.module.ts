import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitsChecklistComponent } from './components/habits-checklist/habits-checklist.component';
import { LoginComponent } from './components/login/login.component';
import { TodoComponent } from './components/todo/todo.component';
import { AuthGuardGuard } from './services/auth-guard.guard';

const routes: Routes = [
  { path: 'todo', component: TodoComponent, pathMatch: 'full' },
  { path: '', component: HabitsChecklistComponent, canActivate: [AuthGuardGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent }
  //{ path: '', redirectTo: '/home' },
  //{ path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
