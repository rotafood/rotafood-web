import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSideMenuComponent } from './dash-side-menu.component';

describe('DashSideMenuComponent', () => {
  let component: DashSideMenuComponent;
  let fixture: ComponentFixture<DashSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashSideMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
