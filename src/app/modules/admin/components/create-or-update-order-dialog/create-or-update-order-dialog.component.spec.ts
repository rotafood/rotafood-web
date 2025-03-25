import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdateOrderDialogComponent } from './create-or-update-order-dialog.component';

describe('CreateOrUpdateOrderDialogComponent', () => {
  let component: CreateOrUpdateOrderDialogComponent;
  let fixture: ComponentFixture<CreateOrUpdateOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrUpdateOrderDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateOrUpdateOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
