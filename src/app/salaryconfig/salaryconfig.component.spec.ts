import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryconfigComponent } from './salaryconfig.component';

describe('SalaryconfigComponent', () => {
  let component: SalaryconfigComponent;
  let fixture: ComponentFixture<SalaryconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryconfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
