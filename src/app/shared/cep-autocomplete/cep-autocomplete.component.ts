import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { AddressDto } from '../../core/interfaces/address';
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
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cep-autocomplete.component.html',
  styleUrl: './cep-autocomplete.component.scss'
})
export class CepAutocompleteComponent implements OnInit {
  @Input() address?: AddressDto | null;
  @Input() mode: 'cep' | 'search' | 'manual' = 'cep';
  @Output() addressFound = new EventEmitter<AddressDto>();

  isManualSelection = false;

  /* Form */
  cepForm = new FormGroup({
    id: new FormControl<string | null>(null),
    postalCode: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(9),
    ]),
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

  /* Autocomplete */
  searchCtrl = new FormControl('');
  suggestions: AddressDto[] = [];

  /* State */
  loading = false;
  private lastCepRequested: string | null = null;
  private lastEmittedAddress: AddressDto | null = null;

  constructor(private placesService: PlacesService, private snackBar: MatSnackBar) {}

  /* Lifecycle */
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
        const current = this.cepForm.getRawValue() as AddressDto;
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
      if (addr.postalCode !== this.cepForm.controls.postalCode.value) {
        this.patchFormWithAddress(addr);
      }
    }
  }

  /* Helpers */
  private patchFormWithAddress(addr: AddressDto) {
    this.cepForm.patchValue({
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
    const v = this.cepForm.getRawValue();
    if (v.streetName && v.neighborhood && v.city && v.state && v.postalCode) {
      return `${v.streetName}, ${v.streetNumber || ''} - ${v.neighborhood}, ${v.city} - ${v.state}, ${v.postalCode}`;
    }
    return null;
  }

  /* Mode switch */
  setMode(m: 'cep' | 'search' | 'manual') {
    this.mode = m;
    this.isManualSelection = false;

    m === 'manual' ? this.clearValidatorsForManual() : this.restoreCepValidators();

    if (m !== 'cep') this.cepForm.get('postalCode')?.reset();
    if (m !== 'search') this.searchCtrl.reset();
  }

  /* CEP */
  onPostalCodeBlur(): void {
    if (this.mode !== 'cep') return;
    const cep = this.cepForm
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
        this.addressFound.emit(this.cepForm.getRawValue() as AddressDto);
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

  /* Autocomplete */
  onAddressSelected(addr: AddressDto) {
    this.patchFormWithAddress(addr);
    this.isManualSelection = true;
    this.addressFound.emit(addr);
  }

  displayAddress = (addr: AddressDto | null): string =>
    addr ? addr.formattedAddress || this.formatSuggestion(addr) : '';

  formatSuggestion(a: AddressDto): string {
    return `${a.streetName}, ${a.neighborhood}, ${a.city}-${a.state}`;
  }

  /* Validators */
  private clearValidatorsForManual() {
    ['postalCode', 'latitude', 'longitude'].forEach((c) => this.cepForm.get(c)?.clearValidators());
    this.cepForm.updateValueAndValidity();
  }

  private restoreCepValidators() {
    this.cepForm.get('postalCode')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(9)]);
    this.cepForm.updateValueAndValidity();
  }
}
