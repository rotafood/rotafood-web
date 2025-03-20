import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CepAutocompleteComponent } from './cep-autocomplete.component';

describe('CepAutocompleteComponent', () => {
  let component: CepAutocompleteComponent;
  let fixture: ComponentFixture<CepAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CepAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CepAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
