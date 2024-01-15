import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesemployeComponent } from './leavesemploye.component';

describe('LeavesemployeComponent', () => {
  let component: LeavesemployeComponent;
  let fixture: ComponentFixture<LeavesemployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavesemployeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeavesemployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
