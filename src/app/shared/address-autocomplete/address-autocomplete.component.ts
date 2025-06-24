import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { AddressDto } from '../../core/interfaces/shared/address';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlacesService } from '../../core/services/places/places.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-address-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './address-autocomplete.component.html',
  styleUrl: './address-autocomplete.component.scss'
})
export class AddressAutocompleteComponent implements OnInit {
  @Input() address?: AddressDto | null;
  @Input() mode: 'cep' | 'search' | 'manual' = 'cep';
  @Output() addressFound = new EventEmitter<AddressDto>();


  addressForm = new FormGroup({
    id: new FormControl<string | null>(null),
    postalCode: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(9),
    ]),
    streetName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    streetNumber: new FormControl('', [Validators.required, Validators.minLength(1)]),
    neighborhood: new FormControl('', [Validators.required, Validators.minLength(3)]),
    formattedAddress: new FormControl(''),
    country: new FormControl('Brasil'),
    city: new FormControl('', [Validators.required, Validators.minLength(3)]),
    state: new FormControl('', [Validators.required, Validators.minLength(3)]),
    complement: new FormControl(''),
    latitude: new FormControl(0.0, [Validators.required, Validators.min(-90), Validators.max(90)]),
    longitude: new FormControl(0.0, [Validators.required, Validators.min(-90), Validators.max(90)]),
  });

  searchCtrl = new FormControl('');
  suggestions: AddressDto[] = [];

  loading = false;
  private lastCepRequested: string | null = null;
  private lastEmittedAddress: AddressDto | null = null;

  constructor(private placesService: PlacesService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    if (this.address) {
      this.patchFormWithAddress(this.address);
      this.lastCepRequested = this.address.postalCode;
    }

    this.addressForm.valueChanges.subscribe(() => {
      const formatted = this.getFormattedAddress();
      if (formatted && this.addressForm.get('formattedAddress')?.value !== formatted) {
        this.addressForm.get('formattedAddress')?.setValue(formatted, { emitEvent: false });
      }
      if (this.addressForm.valid) {
        const current = this.addressForm.getRawValue() as AddressDto;
        if (JSON.stringify(this.lastEmittedAddress) !== JSON.stringify(current)) {
          this.lastEmittedAddress = current;
          this.addressFound.emit(current);
        }
      }
    });

    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((v) => typeof v === 'string' && (v as string).length >= 5),
        switchMap((q) => this.placesService.searchAddress(q as string))
      )
      .subscribe((list) => (this.suggestions = list));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address']?.currentValue) {
      const addr = changes['address'].currentValue as AddressDto;
      if (addr.postalCode !== this.addressForm.controls.postalCode.value) {
        this.patchFormWithAddress(addr);
      }
    }
  }

  private patchFormWithAddress(addr: AddressDto) {
    this.addressForm.patchValue({
      id: addr.id ?? null,
      postalCode: addr.postalCode ?? '',
      streetName: addr.streetName ?? '',
      streetNumber: addr.streetNumber ?? '',
      neighborhood: addr.neighborhood ?? '',
      city: addr.city ?? '',
      state: addr.state ?? '',
      complement: addr.complement ?? '',
      latitude: addr.latitude ?? 0,
      longitude: addr.longitude ?? 0,
    });
  }
  

  getFormattedAddress(): string | null {
    const v = this.addressForm.getRawValue();
    if (v.streetName && v.neighborhood && v.city && v.state && v.postalCode) {
      return `${v.streetName}, ${v.streetNumber || ''} - ${v.neighborhood}, ${v.city} - ${v.state}, ${v.postalCode}`;
    }
    return null;
  }

  setMode(m: 'search' | 'manual') {
    this.mode = m;

    m === 'manual' ? this.clearValidatorsForManual() : this.restoreCepValidators();

    if (m !== 'search') this.searchCtrl.reset();
  }

  onPostalCodeBlur(): void {
    if (this.mode !== 'cep') return;
    const cep = this.addressForm
      .get('postalCode')!
      .value?.toString()
      .replace('-', '')
      .trim();
    if (cep && cep.length >= 8 && cep !== this.lastCepRequested) {
      this.lastCepRequested = cep;
      this.fetchAddressByCep(cep);
    }
  }

  private fetchAddressByCep(cep: string) {
    this.loading = true;
    this.placesService.getAddressByCep(cep).subscribe({
      next: (data) => {
        this.patchFormWithAddress(data);
        this.loading = false;
        this.addressFound.emit(this.addressForm.getRawValue() as AddressDto);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('CEP não encontrado ou inválido.', 'Fechar', {
          duration: 4000,
          verticalPosition: 'top',
        });
      },
    });
  }

  onAddressSelected(addr: AddressDto) {
    this.patchFormWithAddress(addr);
    this.addressFound.emit(addr);
  }

  displayAddress = (addr: AddressDto | null): string =>
    addr ? addr.formattedAddress || this.formatSuggestion(addr) : '';

  formatSuggestion(a: AddressDto): string {
    return `${a.streetName}, ${a.neighborhood}, ${a.city}-${a.state}`;
  }

  getUserLocation(): void {
    if (!navigator.geolocation) {
      this.snackBar.open('Geolocalização não é suportada pelo seu navegador.', 'Fechar', {
        duration: 4000,
        verticalPosition: 'top',
      });
      return;
    }

    this.loading = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.placesService.getAddressByLatitudeAndLongitude(latitude, longitude).subscribe({
          next: (response) => {
            this.patchFormWithAddress(response);
            this.loading = false;

          },
          error: () => {
            this.loading = false;
            this.snackBar.open('Não foi possível obter seu endereço', 'fechar');
          }
        });
      },
      (error) => {
        this.loading = false;
        let errorMessage = 'Não foi possível obter sua localização.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Você negou a permissão de acesso à localização.';
        }
        this.snackBar.open(errorMessage, 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
        });
      }
    );
  }

  private clearValidatorsForManual() {
    ['postalCode', 'latitude', 'longitude'].forEach((c) => this.addressForm.get(c)?.clearValidators());
    this.addressForm.updateValueAndValidity();
  }

  private restoreCepValidators() {
    this.addressForm.get('postalCode')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(9)]);
    this.addressForm.updateValueAndValidity();
  }
}
