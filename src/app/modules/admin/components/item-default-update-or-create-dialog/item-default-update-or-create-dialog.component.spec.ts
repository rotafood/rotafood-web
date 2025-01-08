import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDefaultUpdateOrCreateDialogComponent } from './item-default-update-or-create-dialog.component';

describe('ItemDefaultUpdateOrCreateDialogComponent', () => {
  let component: ItemDefaultUpdateOrCreateDialogComponent;
  let fixture: ComponentFixture<ItemDefaultUpdateOrCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDefaultUpdateOrCreateDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemDefaultUpdateOrCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
