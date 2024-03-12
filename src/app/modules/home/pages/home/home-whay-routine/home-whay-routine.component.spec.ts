import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWhayRoutineComponent } from './home-whay-routine.component';

describe('HomeWhayRoutineComponent', () => {
  let component: HomeWhayRoutineComponent;
  let fixture: ComponentFixture<HomeWhayRoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeWhayRoutineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeWhayRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
