import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoComponent } from './components/todo/todo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModulesModule } from './material-modules/material-modules.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HabitsChecklistComponent } from './components/habits-checklist/habits-checklist.component';
import { CreateEditHabitComponent } from './components/create-edit-habit/create-edit-habit.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    NavbarComponent,
    HabitsChecklistComponent,
    CreateEditHabitComponent,
    LoginComponent
  ],
  imports: [
    MaterialModulesModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
