import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent implements OnInit {
  posts: any[] = [];
  selectedPost: any = null;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  formData: any = {
    nom_post: '',
    description_post: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchPosts();
  }

  trackByPost(index: number, item: any): number {
    return item.id_post;
  }

  selectPost(post: any): void {
    this.selectedPost = post;
  }

  fetchPosts(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.get<any[]>('http://localhost:8080/posts', { headers })
      .subscribe(
        response => {
          console.log('Posts data:', response);
          this.posts = response;
        },
        error => {
          console.error('Error fetching posts:', error);
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

    this.http.post('http://localhost:8080/posts', this.formData, { headers })
      .subscribe(
        response => {
          console.log('Post created:', response);
          this.formData = { nom_post: '', description_post: '' };
          this.showAddModal = false;
          this.fetchPosts();
        },
        error => {
          console.error('Error creating post:', error);
        }
      );
  }

  handleEditPost(post: any): void {
    this.selectedPost = post;
    this.showEditModal = true;
    this.formData = { ...post };
  }

  handleUpdatePost(): void {
    const userToken = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

    this.http.put(`http://localhost:8080/posts/${this.formData.id_post}`, this.formData, { headers })
      .subscribe(
        () => {
          this.showEditModal = false;
          this.fetchPosts();
        },
        (error) => {
          console.error('Error updating post:', error);
        }
      );
  }

  handleDeletePost(): void {
    this.showDeleteModal = true;
  }

  confirmDeletePost(): void {
    console.log('Confirming deletion of Post');
    console.log('Selected Post:', this.selectedPost);

    if (this.selectedPost) {
      const userToken = localStorage.getItem('jwtToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${userToken}`);

      this.http.delete(`http://localhost:8080/posts/${this.selectedPost.id_post}`, { headers })
        .subscribe(
          () => {
            console.log('Post deleted successfully');
            this.selectedPost = null;
            this.showDeleteModal = false;
            this.fetchPosts();
          },
          (error) => {
            console.error('Error deleting post:', error);
            this.selectedPost = null;
            this.showDeleteModal = false;
          }
        );
    } else {
      console.log('No selected post to delete');
    }
  }
}
