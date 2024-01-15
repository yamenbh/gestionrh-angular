import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})

export class HolidaysComponent implements OnInit {
  vacances: any[] = [];
  selectedVacance: any = null;

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  
  formData: any = {
    nom_vacance: '',
    datedebut_vacance: '',
    datefin_vacance: '',
    nbrjour_vacance: ''
  };

  // Add this method to track items by id_vacance
  trackByVacance(index: number, item: any): number {
    return item.id_vacance;
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchVacances();
  }

  fetchVacances(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.get<any[]>('http://localhost:8080/vacances', { headers })
      .subscribe(
        response => {
          console.log('Vacances data:', response);
          this.vacances = response;
        },
        error => {
          console.error('Error fetching vacances:', error);
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

    this.http.post('http://localhost:8080/vacances', this.formData, { headers })
      .subscribe(
        response => {
          console.log('Vacance created:', response);

          this.formData = {
            nom_vacance: '',
            datedebut_vacance: '',
            datefin_vacance: '',
            nbrjour_vacance: ''
          };
          this.showAddModal = false;
          this.fetchVacances();
        },
        error => {
          console.error('Error creating vacance:', error);
        }
      );
  }

  handleEditVacance(vacance: any): void {
    this.selectedVacance = vacance;
    this.showEditModal = true;
    this.formData = { ...vacance };
  }

  handleUpdateVacance(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.put(`http://localhost:8080/vacances/${this.formData.id_vacance}`, this.formData, { headers })
      .subscribe(
        () => {
          this.showEditModal = false;
          this.fetchVacances();
        },
        error => {
          console.error('Error updating vacance:', error);
        }
      );
  }

  confirmDelete: boolean = false;

  handleDeleteVacance(): void {
    if (this.confirmDelete && this.selectedVacance) {
      const userToken = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

      this.http.delete(`http://localhost:8080/vacances/${this.selectedVacance.id_vacance}`, { headers })
        .subscribe(
          () => {
            console.log('Vacance deleted successfully');
            this.selectedVacance = null;
            this.showDeleteModal = false;
            this.fetchVacances();
          },
          error => {
            console.error('Error deleting vacance:', error);
            this.selectedVacance = null;
            this.showDeleteModal = false;
          }
        );

      // Reset the flag after deletion
      this.confirmDelete = false;
    }
  }
}
