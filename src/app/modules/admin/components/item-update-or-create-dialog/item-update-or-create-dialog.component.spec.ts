import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUpdateOrCreateDialogComponent } from './item-update-or-create-dialog.component';

describe('ItemUpdateOrCreateDialogComponent', () => {
  let component: ItemUpdateOrCreateDialogComponent;
  let fixture: ComponentFixture<ItemUpdateOrCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemUpdateOrCreateDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemUpdateOrCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
