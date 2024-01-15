// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainIndexComponent } from './main-index/main-index.component';
import { LoginComponent } from './login/login.component';
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



export const routes: Routes = [
  { path: 'mainindex', component: MainIndexComponent },
  { path: '', component: LoginComponent },
  { path: 'departments', component: DepartmentsComponent},
  { path: 'designations', component: DesignationsComponent},
  { path: 'holidays', component: HolidaysComponent},
  { path: 'employees', component: EmployeesListComponent},
  { path: 'gestionnaires', component: GestionnairesListComponent},
  { path: 'conges', component: LeavesComponent},
  { path: 'congesemployee', component: LeavesemployeComponent},
  { path: 'reclamations', component: ReclamationsComponent},
  { path: 'reclamationsemployee', component: ReclamationsemployeeComponent},
  { path: 'salaryconfig', component: SalaryconfigComponent},
  { path: 'salary', component: SalaryComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
