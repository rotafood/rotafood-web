import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Address } from '../../core/interfaces/address';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CepV1 } from '../../core/interfaces/cep';

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
export class CepAutocompleteComponent implements OnInit, OnChanges {
  
  @Input() address?: Address;
  @Output() addressFound = new EventEmitter<Address>();

  showAddressDetails = false;


  cepForm = new FormGroup({
    id: new FormControl(),
    postalCode: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]),
    streetName: new FormControl('', Validators.required),
    streetNumber: new FormControl('', Validators.required),
    neighborhood: new FormControl('', Validators.required),
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
    if (changes['address'] && this.address) {
      this.patchFormWithAddress(this.address);
    }
  }

  private patchFormWithAddress(address: Address) {
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
  

  buscarEnderecoPorCep() {
    const cep = this.cepForm.controls.postalCode.value;
    if (!cep || cep.length < 8) return;

    this.http.get<CepV1>(`https://brasilapi.com.br/api/cep/v1/${cep.replace('-', '')}`).subscribe({
      next: (data) => {
        this.cepForm.patchValue({
          streetName: data.street,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state
        });

        this.pedirLocalizacaoUsuario(data);
      },
      error: () => {
        alert('CEP não encontrado ou inválido.');
      }
    });
  }

  pedirLocalizacaoUsuario(data: any) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const address: Address = {
          id: this.cepForm.value.id,
          state: data.uf,
          city: data.cidade,
          country: 'Brasil',
          streetName: data.endereco,
          formattedAddress: `${data.endereco}, ${data.bairro}, ${data.cidade} - ${data.uf}, CEP: ${data.cep}`,
          streetNumber: '',
          postalCode: data.cep,
          neighborhood: data.bairro,
          complement: this.cepForm.value.complement || '',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        this.cepForm.patchValue({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        this.addressFound.emit(address);
      }, () => {
        const address: Address = {
          id: this.cepForm.value.id,
          state: data.uf,
          city: data.cidade,
          country: 'Brasil',
          streetName: data.endereco,
          formattedAddress: `${data.endereco}, ${data.bairro}, ${data.cidade} - ${data.uf}, CEP: ${data.cep}`,
          streetNumber: '',
          postalCode: data.cep,
          neighborhood: data.bairro,
          complement: this.cepForm.value.complement || '',
          latitude: 0,
          longitude: 0
        };
        this.addressFound.emit(address);
      });
    } else {
      alert('Seu navegador não suporta geolocalização.');
    }
  }
}
