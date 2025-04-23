import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AddressDto } from '../../core/interfaces/address';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CepV1, CepV2 } from '../../core/interfaces/order/cep';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlacesService } from '../../core/services/places/places.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cep-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cep-autocomplete.component.html',
  styleUrl: './cep-autocomplete.component.scss'
})
export class CepAutocompleteComponent implements OnInit {

  private lastCepRequested: string | null = null;

  loading = false;

  @Input() 
  address?: AddressDto | null;

  @Input() 
  isManual = false;

  @Output() addressFound = new EventEmitter<AddressDto>();


  lastEmittedAddress: AddressDto | null = null;

  cepForm = new FormGroup({
    id: new FormControl(),
    postalCode: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]),
    streetName: new FormControl('', Validators.required),
    streetNumber: new FormControl('', Validators.required),
    neighborhood: new FormControl('', Validators.required),
    formattedAddress: new FormControl(''),
    country: new FormControl('Brasil'),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    complement: new FormControl(''),
    latitude: new FormControl(0.0, Validators.required),
    longitude: new FormControl(0.0, Validators.required),
  });

  constructor(private placesService: PlacesService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    if (this.address) {
      this.patchFormWithAddress(this.address);
      this.lastCepRequested = this.address.postalCode;
    }
  
    this.cepForm.valueChanges.subscribe(() => {
      const formatted = this.getFormattedAddress();
      if (formatted && this.cepForm.get('formattedAddress')?.value !== formatted) {
        this.cepForm.get('formattedAddress')?.setValue(formatted, { emitEvent: false });
      }
  
      if (this.cepForm.valid) {
        const currentAddress = this.cepForm.value as AddressDto;
        if (JSON.stringify(this.lastEmittedAddress) !== JSON.stringify(currentAddress)) {
          this.lastEmittedAddress = currentAddress;
          this.addressFound.emit(currentAddress);
        }
      }
    });
  
   
  }
  

  onPostalCodeBlur(): void {
    if (this.isManual) return;
  
    const cep = this.cepForm.get('postalCode')?.value?.replace('-', '').trim();
  
    if (
      cep &&
      cep.length >= 8 &&
      cep !== this.lastCepRequested
    ) {
      this.lastCepRequested = cep;
      this.getAddressByCep();
    }
  }
  
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && changes['address'].currentValue) {
      const currentAddress = changes['address'].currentValue as AddressDto;
      if (currentAddress.postalCode !== this.cepForm.controls.postalCode.value) {
        this.patchFormWithAddress(currentAddress);
      }
    }
  }


  private patchFormWithAddress(address: AddressDto) {

    this.cepForm.patchValue({
      id: address.id ?? null,
      postalCode: address.postalCode ?? '',
      streetName: address.streetName ?? '',
      streetNumber: address.streetNumber ?? '',
      neighborhood: address.neighborhood ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      complement: address.complement ?? '',
      latitude: address.latitude ?? 0,
      longitude: address.longitude ?? 0,
      formattedAddress: this.getFormattedAddress() ?? ''
    });
  }
  
  getFormattedAddress(): string | null {
    const values = this.cepForm.value;
    if (values.streetName && values.neighborhood && values.city && values.state && values.postalCode) {
      return `${values.streetName}, ${values.streetNumber || ''} - ${values.neighborhood}, ${values.city} - ${values.state}, ${values.postalCode}`;
    }
    return null;
  }

  toggleManualMode() {
    this.isManual = !this.isManual;
    if (this.isManual) {
      this.cepForm.get('postalCode')?.clearValidators();
      this.cepForm.get('latitude')?.clearValidators();
      this.cepForm.get('longitude')?.clearValidators();
    } else {
      this.cepForm.get('postalCode')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(9)]);

    }
    this.cepForm.get('postalCode')?.updateValueAndValidity();
    this.cepForm.get('latitude')?.updateValueAndValidity();
    this.cepForm.get('longitude')?.updateValueAndValidity();
  }
  

  getAddressByCep() {
    const cep = this.cepForm.controls.postalCode.value;
    if (!cep || cep.length < 8) return;
  
    this.loading = true;

    this.placesService.getAddressByCep(cep.replace('-', '')).subscribe({
      next: (data) => {
        this.cepForm.patchValue({
          streetName: data.streetName,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          latitude: data.latitude,
          longitude: data.longitude
        });

        this.loading = false;
  
        this.addressFound.emit(this.cepForm.value as AddressDto);
      },
      error: () => {
        this.loading = false;

        this.snackBar.open('CEP não encontrado ou inválido.', 'Fechar', {
          duration: 4000,
          verticalPosition: 'top',
        });
      }
    });
  }
  

  
}
