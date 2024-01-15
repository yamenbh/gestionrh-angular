// Import statements
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-leaves',
  templateUrl: './reclamations.component.html',
  styleUrls: ['./reclamations.component.css']
})
export class ReclamationsComponent implements OnInit {
  reclamations: any[] = [];
  selectedReclamation: any | null = null;

  searchEmployeeName: string = '';
  searchStatusReclamation: string = '';

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  formData: any = {
    date_reclamation:'',
    sujet :'',
    description: '',
    status: 'En cours',
  };
  countReclamationsFermes: number | undefined;
  countReclamationsResolues: number | undefined;;
  countReclamationsEnCours: number | undefined;;
  totalReclamations: number | undefined;;

  // Add this method to track items by id_vacance
  trackByReclamation(index: number, item: any): number {
    return item.id_reclamation;
  }

  selectReclamation(reclamation: any): void {
    this.selectedReclamation = reclamation;
  }
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
        this.fetchReclamations();
        this.calculateCounts(); // Initial count calculation
  }

  fetchReclamations(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });

    this.http.get<any[]>('http://localhost:8080/reclamations', { headers })
      .subscribe(
        response => {
          console.log('Reclamations data:', response);
          this.reclamations = response;
          this.calculateCounts(); // Recalculate counts after fetching reclamations

        },
        error => {
          console.error('Error fetching reclamations:', error);
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

      this.http.post('http://localhost:8080/reclamations', requestData, { headers })
        .subscribe(
          response => {
            console.log('Reclamation created:', response);
            this.formData = {
              date_reclamation: '',
              sujet: '',
              description: '',
              status: ''
            };
            this.showAddModal = false;
            this.fetchReclamations();
          },
          error => {
            console.error('Error creating reclamations:', error);
          }
        );
  }

  handleEditReclamation(reclamation: any): void {
    this.selectedReclamation = reclamation;
    this.showEditModal = true;
    this.formData = { ...reclamation };
  }

  handleUpdateReclamation(event: any): void {
    event.preventDefault();

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.put(`http://localhost:8080/reclamations/${this.formData.id_reclamation}`, this.formData, { headers })
      .subscribe(
        response => {
          console.log('Reclamation updated:', response);
          this.showEditModal = false;
          this.fetchReclamations();
        },
        error => {
          console.error('Error updating reclamation:', error);
        }
      );
  }

  handleDeleteReclamation(): void{
    this.showDeleteModal = true;
  }

  ConfirmDeleteReclamation(): void {
    console.log('Confirming deletion of reclamation');
    console.log('Selected Reclamation:', this.selectedReclamation);

    if (this.selectedReclamation) {
      const userToken = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });

      this.http.delete(`http://localhost:8080/reclamations/${this.selectedReclamation.id_reclamation}`, { headers })
        .subscribe(
          response => {
            console.log('Reclamation deleted:', this.selectedReclamation);
            this.selectedReclamation = null;
            this.showDeleteModal = false;
            this.fetchReclamations();
          },
          (error) => {
            console.error('Error deleting reclamation:', error);
            this.selectedReclamation = null;
            this.showDeleteModal = false;
          }
        );
    }
  }

  handleSolve(reclamationId: any): void {
    const updatedReclamations = this.reclamations.map(reclamation => {
      if (reclamation.id_reclamation === reclamationId) {
        return { ...reclamation, status: 'Résolu' };
      }
      return reclamation;
    });

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });

    this.http.put(`http://localhost:8080/reclamations/${reclamationId}`, updatedReclamations.find(reclamation => reclamation.id_reclamation === reclamationId), { headers })
      .subscribe(
        response => {
          console.log('Reclamation solved:', response);
          this.reclamations = updatedReclamations;
        },
        error => {
          console.error('Error solving reclamation:', error);
        }
      );
  }

  handleDecline(reclamationId: any): void {
    const updatedReclamations = this.reclamations.map(reclamation => {
      if (reclamation.id_reclamation === reclamationId) {
        return { ...reclamation, status: 'Refusé' };
      }
      return reclamation;
    });

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });

    this.http.put(`http://localhost:8080/reclamations/${reclamationId}`, updatedReclamations.find(reclamation => reclamation.id_reclamation === reclamationId), { headers })
      .subscribe(
        response => {
          console.log('Reclamation Declined:', response);
          this.reclamations = updatedReclamations;
        },
        error => {
          console.error('Error declining reclamation:', error);
        }
      );
  }

  handleClose(reclamationId: any): void {
    const updatedReclamations = this.reclamations.map(reclamation => {
      if (reclamation.id_reclamation === reclamationId) {
        return { ...reclamation, status: 'Fermé' };
      }
      return reclamation;
    });

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });

    this.http.put(`http://localhost:8080/reclamations/${reclamationId}`, updatedReclamations.find(reclamation => reclamation.id_reclamation === reclamationId), { headers })
      .subscribe(
        response => {
          console.log('Reclamation Closed:', response);
          this.reclamations = updatedReclamations;
        },
        error => {
          console.error('Error closing reclamation:', error);
        }
      );
  }


  countReclamationsByStatus(status: string): number {
    return this.reclamations.filter(reclamation => reclamation.status === status).length;
  }

  calculateCounts(): void {
    this.countReclamationsFermes = this.countReclamationsByStatus('Fermé');
    this.countReclamationsResolues = this.countReclamationsByStatus('Résolu');
    this.countReclamationsEnCours = this.countReclamationsByStatus('En cours');
    this.totalReclamations = this.reclamations.length;
  }

  handleSearch(): void {
    const filteredReclamations = this.reclamations.filter(reclamation => {

      const employeeName = `${reclamation.employe?.nom} ${reclamation.employe?.prenom}`.toLowerCase();
      const searchName = this.searchEmployeeName ? this.searchEmployeeName.toLowerCase() : '';

      const reclamationStatus = reclamation.status? reclamation.status.toString().toLowerCase() : '';
      const searchStatus = this.searchStatusReclamation ? this.searchStatusReclamation.toLowerCase() : '';

      if (searchName && employeeName.includes(searchName)) {
        return true;
      }

      if (searchStatus && reclamationStatus.includes(searchStatus)) {
        return true;
      }

      return false;
    });

    this.reclamations = filteredReclamations;
  }

  handleResetSearch(): void {
    this.searchEmployeeName = '';
    this.fetchReclamations();
  }

  // Inside your ReclamationsComponent class
  getStatusIconClass(status: string): string {
    switch (status) {
      case 'Fermé':
        return 'fa fa-dot-circle-o text-primary';
      case 'Résolu':
        return 'fa fa-dot-circle-o text-success';
      case 'Refusé':
        return 'fa fa-dot-circle-o text-danger';
      default:
        return 'fa fa-dot-circle-o text-purple';
    }
  }
  // Inside your ReclamationsComponent class
  getStatusClass(status: string): string {
    switch (status) {
      case 'Fermé':
        return 'btn btn-white btn-sm btn-rounded dropdown-toggle text-primary';
      case 'Résolu':
        return 'btn btn-white btn-sm btn-rounded dropdown-toggle text-success';
      case 'Refusé':
        return 'btn btn-white btn-sm btn-rounded dropdown-toggle text-danger';
      default:
        return 'btn btn-white btn-sm btn-rounded dropdown-toggle text-purple';
    }
  }

}
