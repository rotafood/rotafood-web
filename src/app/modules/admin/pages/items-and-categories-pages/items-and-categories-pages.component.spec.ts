import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsAndCategoriesPagesComponent } from './items-and-categories-pages.component';

describe('ItemsAndCategoriesPagesComponent', () => {
  let component: ItemsAndCategoriesPagesComponent;
  let fixture: ComponentFixture<ItemsAndCategoriesPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsAndCategoriesPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemsAndCategoriesPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
