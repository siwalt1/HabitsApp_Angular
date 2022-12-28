import { Component, OnInit } from '@angular/core';
import { SupabaseApiService } from 'src/app/services/supabase-api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public supabaseApi: SupabaseApiService) { }

  ngOnInit(): void {
  }

}
