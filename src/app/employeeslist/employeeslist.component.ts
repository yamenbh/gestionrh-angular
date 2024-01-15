import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employeeslist.component.html',
  styleUrls: ['./employeeslist.component.css']
})
export class EmployeesListComponent implements OnInit {
  employees: any[] = [];
  departments: any[] = [];
  posts: any[] = [];

  selectedEmployee: any = null;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  searchEmployeeMATRICULE: string = "";
  searchEmployeeName: string = "";

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
  trackByEmployee(index: number, item: any): number {
    return item.id;
  }

  selectEmployee(employee: any): void {
    this.selectedEmployee = employee;
  }


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    const userToken = localStorage.getItem('jwtToken');

    this.http.get('http://localhost:8080/employes', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${userToken}`,
      }),
    }).subscribe((response: any) => {
      const employeeWithEmployeeRole = response.filter(
        (employee: any) =>
          employee.roles.some((role: any) => role.name === 'ROLE_EMPLOYE')
      );
      console.log('Employees with EMPLOYEE role:', employeeWithEmployeeRole);
      this.employees = employeeWithEmployeeRole;
    }, (error) => {
      console.error('Error fetching employee:', error);
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
          console.log("Employee created:", response.data);

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
          this.fetchEmployees();
        }, (error) => {
          console.error("Error creating employee:", error);
        });
  }

  handleEditEmployee(employee: any): void {
    this.selectedEmployee = employee;
    this.showEditModal = true;
    this.formData = { ...employee };
  }

  handleUpdateEmployee(event: any): void {
    event.preventDefault();

    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    console.log("Form Data:", this.formData);


    this.http.put(`http://localhost:8080/employes/${this.formData.id}`, this.formData, { headers })
      .subscribe(() => {
        this.showEditModal = false;
        this.fetchEmployees();
      }, (error) => {
        console.error("Error updating employee:", error);
      });
  }

  handleDeleteEmployee(): void{
    this.showDeleteModal = true;
  }

  confirmDeleteEmployee(): void {
    console.log('Confirming deletion of Employee');
    console.log('Selected Employe:', this.selectedEmployee);

    if (this.selectedEmployee) {
      const userToken = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

      this.http.delete(`http://localhost:8080/employes/${this.selectedEmployee.id}`, { headers })
        .subscribe(() => {
          console.log("Employee deleted successfully");
          this.selectedEmployee = null;
          this.showDeleteModal = false;
          this.fetchEmployees();
        },
        (error) => {
          console.error("Error deleting employee:", error);
          this.selectedEmployee = null;
          this.showDeleteModal = false;
        });
    }
  }

  handleSearch(): void {
    const filteredEmployees = this.employees.filter((employee: any) => {
      const employeeMATRICULE = employee.matricule ? employee.matricule.toString().toLowerCase() : '';
      const searchMATRICULE = this.searchEmployeeMATRICULE ? this.searchEmployeeMATRICULE.toLowerCase() : '';

      const employeeName = `${employee.nom} ${employee.prenom}`.toLowerCase();
      const searchName = this.searchEmployeeName ? this.searchEmployeeName.toLowerCase() : '';

      if (searchMATRICULE && employeeMATRICULE.includes(searchMATRICULE)) {
        return true;
      }

      if (searchName && employeeName.includes(searchName)) {
        return true;
      }

      return false;
    });

    this.employees = filteredEmployees;
  }

  handleResetSearch(): void {
    this.searchEmployeeMATRICULE = "";
    this.searchEmployeeName = "";

    this.fetchEmployees();

  }

  handleRoleChange(event: any): void {
    const selectedRoles = Array.from(event.target.selectedOptions, (option: any) => option.value);
    this.formData = {
      ...this.formData,
      role: selectedRoles,
    };
  }
}
