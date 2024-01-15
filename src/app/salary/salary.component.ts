import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {
  salaires: any[] = [];
  employees: any[] = [];

  selectedSalaire: any = null;

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;


  searchEmployeeMATRICULE: string = "";
  searchEmployeeName: string = "";


  formData: any = {
    nombreJourOuvre: "",
    date_joindre: "",
    salaireBaseMensuel: "",
    employe: "",
  };

  // Add this method to track items by id_vacance
  trackBySalary(index: number, item: any): number {
    return item.id_salaire;
  }

  selectSalary(salaire: any): void {
    this.selectedSalaire = salaire;
  }


  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.fetchSalaires();
  }

  fetchSalaires(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.get('http://localhost:8080/salaires', { headers })
      .subscribe((response: any) => {
        console.log("Salaires data:", response);
        this.salaires = response;
      }, error => {
        console.error("Error fetching salaires:", error);
      });

    this.http.get('http://localhost:8080/employes', { headers })
      .subscribe((response: any) => {
        console.log("Employees data:", response);
        this.employees = response;
      }, error => {
        console.error("Error fetching employees:", error);
      });
  }

  handleInputChange(event: any): void {
    const { name, value } = event.target;

    if (name === "employe") {
      const selectedObject = event.target.options[event.target.selectedIndex].value;
      console.log(selectedObject);

      try {
        const parsedObject = JSON.parse(selectedObject);

        this.formData = {
          ...this.formData,
          [name]: parsedObject,
        };

        console.log(parsedObject); // Log the parsed object for debugging
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      this.formData = {
        ...this.formData,
        [name]: value,
      };
    }
  }

  handleSubmit(event: any): void {
    event.preventDefault();
    const userToken = localStorage.getItem('jwtToken');
    console.log("Form Data:", this.formData);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);
    console.log("Form Data:", this.formData);

    this.http.post('http://localhost:8080/salaires', this.formData, { headers })
      .subscribe((response: any) => {
        console.log("Salaire created:", response);
        this.formData = {
          nombreJourOuvre: "",
          date_joindre: "",
          salaireBaseMensuel: "",
          employe: "",
        };
        this.showAddModal = false;
        this.fetchSalaires();
      }, (error) => {
        console.error("Error creating salaires:", error);
      });
  }


  handleEditSalaire(salaire: any): void {
    this.selectedSalaire = salaire;
    this.showEditModal = true;
    this.formData = { ...salaire };
  }

  handleUpdateSalaire(event: any): void {
    event.preventDefault();

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    console.log("Form Data:", this.formData);


    this.http.put(`http://localhost:8080/salaires/${this.formData.id_salaire}`, this.formData, { headers })
        .subscribe(() => {
            this.showEditModal = false;
            this.fetchSalaires();
          }, (error) => {
            console.error("Error updating salaire:", error);
        });
  }

  handleDeleteSalaire(): void{
    this.showDeleteModal = true;
  }

  ConfirmDeleteSalaire(): void {
    console.log('Confirming deletion of salaire');
    console.log('Selected Salaire:', this.selectedSalaire);

    if (this.selectedSalaire) {
        const userToken = localStorage.getItem('jwtToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

        this.http.delete(`http://localhost:8080/salaires/${this.selectedSalaire.id_salaire}`, { headers })
            .subscribe(() => {
                console.log("Salaire deleted:", this.selectedSalaire);
                this.selectedSalaire = null;
                this.showDeleteModal = false;
                this.fetchSalaires();
            }, error => {
                console.error("Error deleting salaire:", error);
                this.selectedSalaire = null;
                this.showDeleteModal = false;
            });
    }
  }

  handleSearch(): void {
    const filteredSalaires = this.salaires.filter((salaire) => {

      const employeeName = `${salaire.employe?.nom} ${salaire.employe?.prenom}`.toLowerCase();
      const searchName = this.searchEmployeeName ? this.searchEmployeeName.toLowerCase() : '';


      const employeeMATRICULE = `${salaire.employe?.matricule}`.toLowerCase();
      const searchMATRICULE = this.searchEmployeeMATRICULE ? this.searchEmployeeMATRICULE.toLowerCase() : '';
  
        if (searchMATRICULE && employeeMATRICULE.includes(searchMATRICULE)) {
            return true;
        }

        if (searchName && employeeName.includes(searchName)) {
            return true;
        }

        return false;
    });

    this.salaires = filteredSalaires;
  }

  handleResetSearch(): void {
    this.searchEmployeeMATRICULE = "";
    this.searchEmployeeName = "";
    this.fetchSalaires();
  }



}
