import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Habit } from 'src/app/models/habit.model';
import { SupabaseApiService } from 'src/app/services/supabase-api.service';

@Component({
  selector: 'app-create-edit-habit',
  templateUrl: './create-edit-habit.component.html',
  styleUrls: ['./create-edit-habit.component.scss']
})
export class CreateEditHabitComponent implements OnInit {

  habit: Habit;

  constructor(public dialogRef: MatDialogRef<CreateEditHabitComponent>, private supabaseApi: SupabaseApiService, @Inject(MAT_DIALOG_DATA) public data: Habit) {
    if (this.data) {
      this.habit = this.data;
    } else {
      this.habit = new Habit();
      this.habit.color = '#90A4AE';
      this.habit.user_id = this.supabaseApi.supabase.auth.session()?.user?.id!;
    }
  }

  ngOnInit(): void {
  }

  setColor(color: string) {
    this.habit.color = color;
  }

  onSubmit() {
    if (this.habit.name && this.habit.description) {
      if (this.data) {
        this.supabaseApi.updateHabit(this.habit);
      } else {
        this.supabaseApi.addHabit(this.habit);
      }
      this.dialogRef.close();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    if (confirm('Wirklich löschen? Vorgang kann nicht rückgängig gemacht werden!')) {
      this.supabaseApi.deleteHabit(this.habit);
      this.dialogRef.close();
    }
  }
}
