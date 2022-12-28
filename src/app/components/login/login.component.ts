import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseApiService } from 'src/app/services/supabase-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isRegister: boolean;

  email: string = '';
  password: string = '';

  firstname: string = '';
  lastname: string = '';

  constructor(private router: Router, private supabaseApi: SupabaseApiService) {
    this.isRegister = this.router.url == '/register';
  }

  ngOnInit(): void {
    if(this.supabaseApi.supabase.auth.session()){
      this.router.navigateByUrl('/')
    }
  }

  login() {
    if (this.email && this.password) {
      this.supabaseApi.login(this.email, this.password);
    }
  }

  register() {
    if (this.email && this.password && this.firstname && this.lastname) {
      this.supabaseApi.register(this.email, this.password, this.firstname, this.lastname);
    }
  }
}
