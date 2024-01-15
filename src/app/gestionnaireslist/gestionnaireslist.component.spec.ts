import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnairesListComponent } from './gestionnaireslist.component';

describe('GestionnaireslistComponent', () => {
  let component: GestionnairesListComponent;
  let fixture: ComponentFixture<GestionnairesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionnairesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionnairesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
