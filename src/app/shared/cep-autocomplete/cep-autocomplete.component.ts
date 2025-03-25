import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AddressDto } from '../../core/interfaces/address';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CepV1, CepV2 } from '../../core/interfaces/cep';

@Component({
  selector: 'app-cep-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cep-autocomplete.component.html',
  styleUrl: './cep-autocomplete.component.scss'
})
export class CepAutocompleteComponent implements OnInit {

  @Input() 
  version: 'v1' | 'v2' = 'v1'
  
  @Input() 
  address?: AddressDto | null;

  @Output() addressFound = new EventEmitter<AddressDto>();

  showAddressDetails = false;

  lastEmittedAddress: AddressDto | null = null;

  calledGeolocation = false

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.address) {
      this.patchFormWithAddress(this.address);
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
      neighborhood: address.neighborhood ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      complement: address.complement ?? '',
      latitude: address.latitude ?? 0,
      longitude: address.longitude ?? 0
    });
  }

  getFormattedAddress(): string | null {
    const values = this.cepForm.value;
    if (values.streetName && values.neighborhood && values.city && values.state && values.postalCode) {
      return `${values.streetName}, ${values.streetNumber || ''} - ${values.neighborhood}, ${values.city} - ${values.state}, CEP: ${values.postalCode}`;
    }
    return null;
  }
  

  getAddressByCep() {
    const cep = this.cepForm.controls.postalCode.value;
    if (!cep || cep.length < 8) return;

    if (this.version === 'v1') {
      this.http.get<CepV1>(`https://brasilapi.com.br/api/cep/v1/${cep.replace('-', '')}`).subscribe({
        next: (data) => {
          this.cepForm.patchValue({
            streetName: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state
          });
  
          this.cepForm.patchValue({
            postalCode: data.cep,
            streetName: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
          });
          this.cepForm.get('formattedAddress')?.setValue(this.getFormattedAddress())
          this.getGeolocation();
        },
        error: () => {
          alert('CEP não encontrado ou inválido.');
        }
      });
    } else if (this.version === 'v2') {
      this.http.get<CepV2>(`https://brasilapi.com.br/api/cep/v2/${cep.replace('-', '')}`).subscribe({
        next: (data) => {
          this.cepForm.patchValue({
            streetName: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state
          });
  
          this.cepForm.patchValue({
            postalCode: data.cep,
            streetName: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            latitude: data.location.coordinates.latitude,
            longitude: data.location.coordinates.longitude
          });
          this.addressFound.emit(this.cepForm.value as AddressDto)
        },
        error: () => {
          alert('CEP não encontrado ou inválido.');
        }
      });
    }
  }

  getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        
        this.cepForm.patchValue({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        this.addressFound.emit(this.cepForm.value as AddressDto)
  
      }, () => {
      });
    } else {
      alert('Seu navegador não suporta geolocalização.');
    }
  }
  
}
