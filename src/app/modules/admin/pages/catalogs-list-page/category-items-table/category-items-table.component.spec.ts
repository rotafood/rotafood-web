import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryItemsTableComponent } from './category-items-table.component';

describe('CategoryItemsTableComponent', () => {
  let component: CategoryItemsTableComponent;
  let fixture: ComponentFixture<CategoryItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryItemsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
