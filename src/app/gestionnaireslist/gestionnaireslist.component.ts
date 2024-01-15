import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwtDecode from 'jwt-decode'; // Make sure to install 'jwt-decode'


@Component({
  selector: 'app-gestionnaires-list',
  templateUrl: './gestionnaireslist.component.html',
  styleUrls: ['./gestionnaireslist.component.css']
})
export class GestionnairesListComponent implements OnInit {
  gestionnaires: any[] = [];
  departments: any[] = [];
  posts: any[] = [];

  selectedGestionnaire: any = null;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  searchGestionnaireMATRICULE: string = "";
  searchGestionnaireName: string = "";

  formData: any = {
    nom: "",
    prenom: "",
    username: "",
    datenaissance: "",
    email: "",
    password: "",
    matricule: "",
    numerotelephone: "",
    ville: "",
    cin: "",
    age: "",
    role: [],
    sexe: "",
    totalAllocatedDays: "",
    departement: "",
    post: "",
  };

  // Add this method to track items by id_vacance
  trackByGestionnaire(index: number, item: any): number {
    return item.id;
  }

  selectGestionnaire(gestionnaire: any): void {
    this.selectedGestionnaire = gestionnaire;
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchGestionnaires();
  }

  fetchGestionnaires(): void {
    const userToken = localStorage.getItem('jwtToken');

    this.http.get('http://localhost:8080/employes', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${userToken}`,
      }),
    }).subscribe((response: any) => {
      const gestionnaireWithGestionnaireRole = response.filter(
        (gestionnaire: any) =>
          gestionnaire.roles.some((role: any) => role.name === 'ROLE_GESTIONNAIRERH')
      );
      console.log('Gestionnaires with GESTIONNAIRE role:', gestionnaireWithGestionnaireRole);
      this.gestionnaires = gestionnaireWithGestionnaireRole;
    }, (error) => {
      console.error('Error fetching gestionnaire:', error);
    });

    this.http.get("http://localhost:8080/departements", {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${userToken}`,
      }),
    }).subscribe((response: any) => {
      console.log("Departments data:", response);
      this.departments = response;
    }, (error) => {
      console.error("Error fetching departments:", error);
    });

    this.http.get("http://localhost:8080/posts", {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${userToken}`,
      }),
    }).subscribe((response: any) => {
      console.log("Posts data:", response);
      this.posts = response;
    }, (error) => {
      console.error("Error fetching posts:", error);
    });
  }
  handleInputChange(event: any): void {
    const { name, value } = event.target;

    if (name === "departement" || name === "post") {
      const selectedObject = event.target.options[event.target.selectedIndex].value;

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
    console.log("User Token:", userToken);

    if (!userToken) {
      console.log('User token not found.');
      return;
    }


    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    console.log("Form Data:", this.formData);


      this.http.post("http://localhost:8080/api/auth/signup", this.formData, { headers })
        .subscribe((response: any) => {
          console.log("Gestionnaire created:", response.data);

          this.formData = {
            nom: "",
            prenom: "",
            username: "",
            datenaissance: "",
            email: "",
            password: "",
            matricule: "",
            numerotelephone: "",
            ville: "",
            cin: "",
            age: "",
            role: [],
            sexe: "",
            totalAllocatedDays: "",
            departement: "",
            post: "",
          };
          this.showAddModal = false;
          this.fetchGestionnaires();
        }, (error) => {
          console.error("Error creating gestionnaire:", error);
        });
  }

  handleEditGestionnaire(gestionnaire: any): void {
    this.selectedGestionnaire = gestionnaire;
    this.showEditModal = true;
    this.formData = { ...gestionnaire };
  }

  handleUpdateGestionnaire(event: any): void {
    event.preventDefault();

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    console.log("Form Data:", this.formData);


    this.http.put(`http://localhost:8080/employes/${this.formData.id}`, this.formData, { headers })
      .subscribe(() => {
        this.showEditModal = false;
        this.fetchGestionnaires();
      }, (error) => {
        console.error("Error updating gestionnaire:", error);
      });
  }

  handleDeleteGestionnaire(): void{
    this.showDeleteModal = true;
  }

  ConfirmDeleteGestionnaire(): void {
    console.log('Confirming deletion of Gestionnaire');
    console.log('Selected Gestionnaire:', this.selectedGestionnaire);

    if (this.selectedGestionnaire) {
      const userToken = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);


      this.http.delete(`http://localhost:8080/employes/${this.selectedGestionnaire.id}`, { headers })
        .subscribe(() => {
          console.log("Gestionnaire deleted:", this.selectedGestionnaire);
          this.selectedGestionnaire = null;
          this.showDeleteModal = false;
          this.fetchGestionnaires();

        }, (error) => {
          console.error("Error deleting gestionnaire:", error);
          this.selectedGestionnaire = null;
          this.showDeleteModal = false;
        });
    }
  }

  handleSearch(): void {
    const filteredGestionnaires = this.gestionnaires.filter((gestionnaire: any) => {
      const gestionnaireMATRICULE = gestionnaire.matricule ? gestionnaire.matricule.toString().toLowerCase() : '';
      const searchMATRICULE = this.searchGestionnaireMATRICULE ? this.searchGestionnaireMATRICULE.toLowerCase() : '';

      const gestionnaireName = `${gestionnaire.nom} ${gestionnaire.prenom}`.toLowerCase();
      const searchName = this.searchGestionnaireName ? this.searchGestionnaireName.toLowerCase() : '';

      if (searchMATRICULE && gestionnaireMATRICULE.includes(searchMATRICULE)) {
        return true;
      }

      if (searchName && gestionnaireName.includes(searchName)) {
        return true;
      }

      return false;
    });

    this.gestionnaires = filteredGestionnaires;
  }

  handleResetSearch(): void {
    this.searchGestionnaireMATRICULE = "";
    this.searchGestionnaireName = "";

    this.fetchGestionnaires();

  }

  handleRoleChange(event: any): void {
    const selectedRoles = Array.from(event.target.selectedOptions, (option: any) => option.value);
    this.formData = {
      ...this.formData,
      role: selectedRoles,
    };
  }
}
