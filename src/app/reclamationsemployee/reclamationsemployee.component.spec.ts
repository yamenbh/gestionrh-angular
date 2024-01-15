import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationsemployeeComponent } from './reclamationsemployee.component';

describe('ReclamationsemployeeComponent', () => {
  let component: ReclamationsemployeeComponent;
  let fixture: ComponentFixture<ReclamationsemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReclamationsemployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReclamationsemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
