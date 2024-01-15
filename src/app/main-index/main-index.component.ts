// main-index.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-main-index',
  templateUrl: './main-index.component.html',
  styleUrls: ['./main-index.component.css']
})
export class MainIndexComponent implements OnInit {

  departmentsCount: number = 0;
  vacancesCount: number = 0;
  postsCount: number = 0;
  employeesCount: number = 0;

  congesCount: number = 0;
  reclamationsCount: number = 0;
  reposCount: number = 0;
  demissionsCount: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchDepartments();
    this.fetchPosts();
    this.fetchVacances();
    this.fetchEmployees();
    this.fetchConges();
    this.fetchReclamations();
    this.fetchRepos();
    this.fetchDemissions();
  }

  fetchDepartments(): void {
    this.http.get<number>('http://localhost:8080/departements/count', this.getHeaders())
      .subscribe(
        response => this.departmentsCount = response,
        error => console.error('Error fetching departments:', error)
      );
  }

  fetchPosts(): void {
    this.http.get<number>('http://localhost:8080/posts/count', this.getHeaders())
      .subscribe(
        response => this.postsCount = response,
        error => console.error('Error fetching posts:', error)
      );
  }

  fetchVacances(): void {
    this.http.get<number>('http://localhost:8080/vacances/count', this.getHeaders())
      .subscribe(
        response => this.vacancesCount = response,
        error => console.error('Error fetching vacances:', error)
      );
  }

  fetchEmployees(): void {
    this.http.get<number>('http://localhost:8080/employes/count', this.getHeaders())
      .subscribe(
        response => this.employeesCount = response,
        error => console.error('Error fetching employees:', error)
      );
  }

  fetchConges(): void {
    this.http.get<number>('http://localhost:8080/conges/count', this.getHeaders())
      .subscribe(
        response => this.congesCount = response,
        error => console.error('Error fetching conges:', error)
      );
  }

  fetchReclamations(): void {
    this.http.get<number>('http://localhost:8080/reclamations/count', this.getHeaders())
      .subscribe(
        response => this.reclamationsCount = response,
        error => console.error('Error fetching reclamations:', error)
      );
  }

  fetchRepos(): void {
    this.http.get<number>('http://localhost:8080/repos/count', this.getHeaders())
      .subscribe(
        response => this.reposCount = response,
        error => console.error('Error fetching repos:', error)
      );
  }

  fetchDemissions(): void {
    this.http.get<number>('http://localhost:8080/demissions/count', this.getHeaders())
      .subscribe(
        response => this.demissionsCount = response,
        error => console.error('Error fetching demissions:', error)
      );
  }

  private getHeaders(): { headers: HttpHeaders } {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);
    return { headers };
  }
}
