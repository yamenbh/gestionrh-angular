// Import statements
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-leaves',
  templateUrl: './leavesemploye.component.html',
  styleUrls: ['./leavesemploye.component.css']
})
export class LeavesemployeComponent implements OnInit {
  conges: any[] = [];
  selectedConge: any | null = null;

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  formData: any = {
    type_conge: '',
    datedebut_conge: '',
    datefin_conge: '',
    nbrjour_conge: '',
    reason_conge: '',
    status_conge: 'En attente'
  };

  // Add this method to track items by id_vacance
  trackByConge(index: number, item: any): number {
    return item.id;
  }

  selectConge(conge: any): void {
    this.selectedConge = conge;
  }
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
        this.fetchConges();
  }

  fetchConges(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });
    const employeeId = localStorage.getItem("employeeId"); // Retrieve the employee ID

    this.http.get<any[]>(`http://localhost:8080/conges/employe/${employeeId}`, { headers })
    .subscribe(
        response => {
          console.log('Conges data:', response);
          this.conges = response;
        },
        error => {
          console.error('Error fetching conges:', error);
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

  handleSubmit(event: any): void {
    event.preventDefault();
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);
    const employeeId = localStorage.getItem('employeeId');

    const requestData = {
      ...this.formData,
      employe: {
        id: employeeId
      }
    };

      this.http.post('http://localhost:8080/conges', requestData, { headers })
        .subscribe(
          response => {
            console.log('Conge created:', response);
            this.formData = {
              type_conge: '',
              datedebut_conge: '',
              datefin_conge: '',
              nbrjour_conge: '',
              reason_conge: '',
              status_conge: ''
            };
            this.showAddModal = false;
            this.fetchConges();
          },
          error => {
            console.error('Error creating conges:', error);
          }
        );
  }

  handleEditConge(conge: any): void {
    this.selectedConge = conge;
    this.showEditModal = true;
    this.formData = { ...conge };
  }

  handleUpdateConge(event: any): void {
    event.preventDefault();

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.put(`http://localhost:8080/conges/${this.formData.id}`, this.formData, { headers })
      .subscribe(
        response => {
          console.log('Conge updated:', response);
          this.showEditModal = false;
          this.fetchConges();
        },
        error => {
          console.error('Error updating conge:', error);
        }
      );
  }

  handleDeleteConge(): void{
    this.showDeleteModal = true;
  }

  ConfirmDeleteConge(): void {
    console.log('Confirming deletion of conge');
    console.log('Selected Conge:', this.selectedConge);

    if (this.selectedConge) {
      const userToken = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });

      this.http.delete(`http://localhost:8080/conges/${this.selectedConge.id}`, { headers })
        .subscribe(
          response => {
            console.log('Conge deleted:', this.selectedConge);
            this.selectedConge = null;
            this.showDeleteModal = false;
            this.fetchConges();
          },
          (error) => {
            console.error('Error deleting conge:', error);
            this.selectedConge = null;
            this.showDeleteModal = false;
          }
        );
    }
  }

}
