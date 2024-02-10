import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSideMenuExpansionListComponent } from './dash-side-menu-expansion-list.component';

describe('DashSideMenuExpansionListComponent', () => {
  let component: DashSideMenuExpansionListComponent;
  let fixture: ComponentFixture<DashSideMenuExpansionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashSideMenuExpansionListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashSideMenuExpansionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
