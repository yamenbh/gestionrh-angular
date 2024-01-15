import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-salaryconfig',
  templateUrl: './salaryconfig.component.html',
  styleUrl: './salaryconfig.component.css'
})
export class SalaryconfigComponent {

  userRoles: any;
  salairesconfig: any[] = [];
  selectedSalaireConfig: any = null;

  showAddModal = false;
  showEditModal = false;

  formData: any = {
    primeAnciennetepourcentage: "",
    cotisationCNSSpourcentage: "",
    indemnitePerteEmploipourcentage: "",
    cotisationAMOpourcentage: "",
    assuranceMaladieMutuellepourcentage: "",
    cotisationCIMRpourcentage: "",
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
      this.fetchSalairesConfig();
  }

  fetchSalairesConfig(): void {
    const userToken = localStorage.getItem("jwtToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.get("http://localhost:8080/salairesconfig", { headers })
      .subscribe(
        (response: any) => {
          console.log("Parametres data:", response);
          this.salairesconfig = response;
        },
        (error) => {
          console.error("Error fetching salairesconfig:", error);
        }
      );
  }

  handleInputChange(event: any): void {
    const { name, value } = event.target;
    this.formData = {
      ...this.formData,
      [name]: value,
    };
  }

  handleSubmit(): void {
    const userToken = localStorage.getItem("jwtToken");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

      this.http.post("http://localhost:8080/salairesconfig", this.formData, { headers })
        .subscribe(
          (response: any) => {
            console.log("SalairesConfig created:", response);
            this.formData = {
              primeAnciennetepourcentage: "",
              cotisationCNSSpourcentage: "",
              indemnitePerteEmploipourcentage: "",
              cotisationAMOpourcentage: "",
              assuranceMaladieMutuellepourcentage: "",
              cotisationCIMRpourcentage: "",
            };
            this.showAddModal = false;
            this.fetchSalairesConfig();
          },
          (error) => {
            console.error("Error creating salaireconfig:", error);
          }
        );
  }

  handleEditSalaireconfig(salaireconfig: any): void {
    this.selectedSalaireConfig = salaireconfig;
    this.showEditModal = true;
    this.formData = { ...salaireconfig };
  }

  handleUpdateSalaireConfig(): void {
    const userToken = localStorage.getItem("jwtToken");
    console.log("Form Data:", this.formData);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.put(`http://localhost:8080/salairesconfig/${this.formData.id_salaireconfig}`, this.formData, { headers })
      .subscribe(
        () => {
          this.showEditModal = false;
          this.fetchSalairesConfig();
        },
        (error) => {
          console.error("Error updating salaireconfig:", error);
        }
      );
  }


}
