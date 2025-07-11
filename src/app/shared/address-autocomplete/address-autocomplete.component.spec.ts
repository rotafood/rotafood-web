import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressAutocompleteComponent } from './address-autocomplete.component';

describe('AddressAutocompleteComponent', () => {
  let component: AddressAutocompleteComponent;
  let fixture: ComponentFixture<AddressAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
