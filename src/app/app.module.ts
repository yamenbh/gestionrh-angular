import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainIndexComponent } from './main-index/main-index.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationsComponent } from './designations/designations.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { EmployeesListComponent } from './employeeslist/employeeslist.component';
import { GestionnairesListComponent } from './gestionnaireslist/gestionnaireslist.component';
import { LeavesComponent } from './leaves/leaves.component';
import { LeavesemployeComponent } from './leavesemploye/leavesemploye.component';
import { ReclamationsComponent } from './reclamations/reclamations.component';
import { ReclamationsemployeeComponent } from './reclamationsemployee/reclamationsemployee.component';
import { SalaryconfigComponent } from './salaryconfig/salaryconfig.component';
import { SalaryComponent } from './salary/salary.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    NavbarComponent,
    MainIndexComponent,
    DepartmentsComponent,
    DesignationsComponent,
    HolidaysComponent,
    EmployeesListComponent,
    GestionnairesListComponent,
    LeavesComponent,
    LeavesemployeComponent,
    ReclamationsComponent,
    ReclamationsemployeeComponent,
    SalaryconfigComponent,
    SalaryComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
