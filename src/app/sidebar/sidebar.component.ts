// sidebar.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // You can create a separate CSS file or include styles here
})
export class SidebarComponent implements OnInit {

  userRoles: string[] = JSON.parse(localStorage.getItem('userRoles') ?? '[]');

  constructor() { }

  ngOnInit(): void {
  }

}
