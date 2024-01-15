// departments.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})

export class DepartmentsComponent implements OnInit {
  departements: any[] = [];
  selectedDepartement: any = null;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  formData: any = {
    nom_departement: '',
    description: ''
  };

  // Add this method to track items by id_departement
  trackByDepartement(index: number, item: any): number {
    return item.id_departement;
  }

  selectDepartement(departement: any): void {
    this.selectedDepartement = departement;
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchDepartements();
  }

  fetchDepartements(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.get<any[]>('http://localhost:8080/departements', { headers })
      .subscribe(
        response => {
          console.log('Departments data:', response);
          this.departements = response;
        },
        error => {
          console.error('Error fetching departments:', error);
        }
      );
  }

  handleInputChange(event: any): void {
    const { name, value } = event.target;
    this.formData = {
      ...this.formData,
      [name]: value
    };
  }

  handleSubmit(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.post('http://localhost:8080/departements', this.formData, { headers })
      .subscribe(
        response => {
          console.log('Departement created:', response);

          this.formData = {
            nom_departement: '',
            description: ''
          };
          this.showAddModal = false;
          this.fetchDepartements();
        },
        error => {
          console.error('Error creating departement:', error);
        }
      );
  }

  handleEditDepartement(departement: any): void {
    this.selectedDepartement = departement;
    this.showEditModal = true;
    this.formData = { ...departement };
  }

  handleUpdateDepartement(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);
    console.log("Form Data:", this.formData);

    this.http.put(`http://localhost:8080/departements/${this.formData.id_departement}`, this.formData, { headers })
      .subscribe(
        () => {
          this.showEditModal = false;
          this.fetchDepartements();
        },
        (error) => {
          console.error('Error updating departement:', error);
        }
      );
  }

  handleDeleteDepartement(): void {
    // Open the modal to confirm deletion
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.selectedDepartement) {
      const userToken = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

      this.http.delete(`http://localhost:8080/departements/${this.selectedDepartement.id_departement}`, { headers })
        .subscribe(
          () => {
            console.log('Department deleted successfully');
            this.selectedDepartement = null;
            this.showDeleteModal = false;
            this.fetchDepartements();
          },
          (error) => {
            console.error('Error deleting Department:', error);
            this.selectedDepartement = null;
            this.showDeleteModal = false;
          }
        );
    }
  }


}
