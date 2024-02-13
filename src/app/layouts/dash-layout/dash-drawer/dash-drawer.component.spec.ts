import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashDrawerComponent } from './dash-drawer.component';

describe('DashDrawerComponent', () => {
  let component: DashDrawerComponent;
  let fixture: ComponentFixture<DashDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
