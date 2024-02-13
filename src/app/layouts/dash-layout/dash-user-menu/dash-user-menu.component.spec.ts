import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashUserMenuComponent } from './dash-user-menu.component';

describe('DashUserMenuComponent', () => {
  let component: DashUserMenuComponent;
  let fixture: ComponentFixture<DashUserMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashUserMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashUserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
