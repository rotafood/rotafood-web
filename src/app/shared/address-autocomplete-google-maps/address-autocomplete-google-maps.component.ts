import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AddressAutocompleteGoogleMapsService } from '../../core/services/address-autocomplete-google-maps/address-autocomplete-google-maps.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Address } from '../../core/interfaces/address';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { mookAddress } from '../../core/mooks/address';

@Component({
  selector: 'app-address-autocomplete-google-maps',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './address-autocomplete-google-maps.component.html',
  styleUrl: './address-autocomplete-google-maps.component.scss'
})
export class AddressAutocompleteGoogleMapsComponent implements AfterViewInit {
  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;
  @Output() addressSelected = new EventEmitter<Address>();
  @Input() errorMessage: string | null = null;


  public addressWithNumber = true;

  public mookAddress = mookAddress

  constructor(private addressAutocompleteService: AddressAutocompleteGoogleMapsService) {}

  ngAfterViewInit(): void {
    this.addressAutocompleteService.initializeAutocomplete(this.addressInput.nativeElement);
    this.addressAutocompleteService.addressChanged$.subscribe(address => {
      this.addressSelected.emit(address);
      this.addressWithNumber = address.streetNumber == '' ? true:false;
    });
  }

}