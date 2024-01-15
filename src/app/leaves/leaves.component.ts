// Import statements
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {
  conges: any[] = [];
  selectedConge: any | null = null;

  searchEmployeeName: string = '';
  searchTypeConge: string = '';
  searchStatusConge: string = '';

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
  countCongesRefuser: number | undefined;
  countCongesApprouver: number | undefined;;
  countCongesEnAttente: number | undefined;;
  totalConges: number | undefined;;

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
        this.calculateCounts(); // Initial count calculation


  }

  fetchConges(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });

    this.http.get<any[]>('http://localhost:8080/conges', { headers })
      .subscribe(
        response => {
          console.log('Conges data:', response);
          this.conges = response;
          this.calculateCounts(); // Recalculate counts after fetching conges

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

  handleApprove(congeId: any): void {
    const updatedConges = this.conges.map(conge => {
      if (conge.id === congeId) {
        return { ...conge, status_conge: 'Approuvé' };
      }
      return conge;
    });

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });

    this.http.put(`http://localhost:8080/conges/${congeId}`, updatedConges.find(conge => conge.id === congeId), { headers })
      .subscribe(
        response => {
          console.log('Conge approved:', response);
          this.conges = updatedConges;
        },
        error => {
          console.error('Error approving conge:', error);
        }
      );
  }

  handleDecline(congeId: any): void {
    const updatedConges = this.conges.map(conge => {
      if (conge.id === congeId) {
        return { ...conge, status_conge: 'Rejeté' };
      }
      return conge;
    });

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${userToken}` });

    this.http.put(`http://localhost:8080/conges/${congeId}`, updatedConges.find(conge => conge.id === congeId), { headers })
      .subscribe(
        response => {
          console.log('Conge Declined:', response);
          this.conges = updatedConges;
        },
        error => {
          console.error('Error declining conge:', error);
        }
      );
  }

  countCongesByStatus(status_conge: string): number {
    return this.conges.filter(conge => conge.status_conge === status_conge).length;
  }

  calculateCounts(): void {
    this.countCongesRefuser = this.countCongesByStatus('Rejeté');
    this.countCongesApprouver = this.countCongesByStatus('Approuvé');
    this.countCongesEnAttente = this.countCongesByStatus('En attente');
    this.totalConges = this.conges.length;
  }
  handleSearch(): void {
    const filteredConges = this.conges.filter(conge => {

      const employeeName = `${conge.employe?.nom} ${conge.employe?.prenom}`.toLowerCase();
      const searchName = this.searchEmployeeName ? this.searchEmployeeName.toLowerCase() : '';

      const congeType = conge.type_conge ? conge.type_conge.toString().toLowerCase() : '';
      const searchType = this.searchTypeConge ? this.searchTypeConge.toLowerCase() : '';

      const congeStatus = conge.status_conge ? conge.status_conge.toString().toLowerCase() : '';
      const searchStatus = this.searchStatusConge ? this.searchStatusConge.toLowerCase() : '';

      if (searchName && employeeName.includes(searchName)) {
        return true;
      }

      if (searchType && congeType.includes(searchType)) {
        return true;
      }

      if (searchStatus && congeStatus.includes(searchStatus)) {
        return true;
      }

      return false;
    });

    this.conges = filteredConges;
  }

  handleResetSearch(): void {
    this.searchEmployeeName = '';
    this.fetchConges();
  }
}
