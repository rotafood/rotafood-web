import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AddressAutocompleteGoogleMapsComponent } from '../../../shared/address-autocomplete-google-maps/address-autocomplete-google-maps.component';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address } from '../../../core/interfaces/address';
import { RoutineTestService } from '../../../core/services/routine-test/routine-test.service';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { mockAddress } from '../../../core/mocks/address';
import { Cvrp } from '../../../core/interfaces/cvrp';

@Component({
  selector: 'app-routing-forms',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    AddressAutocompleteGoogleMapsComponent
  ],
  providers: [
    RoutineTestService
  ],

  templateUrl: './routing-forms.component.html',
  styleUrl: './routing-forms.component.scss'
})
export class RoutingFormsComponent {

  public testRoutineForms = new FormGroup({
    numberOfOrders: new FormControl<number>(10, [Validators.required, Validators.min(5), Validators.max(500)]),
    address: new FormControl<Address|null>(mockAddress)
  });

  public loading = false;
  public errorMessage: string | null = null; //
  @Output() 
  public cvrp = new EventEmitter<Cvrp>();


  constructor(
    public routingService: RoutineTestService
  ) {}
  
  
  onSubmit() {
    this.errorMessage = null;
    if (this.testRoutineForms.valid) {
      this.loading = true;
      const numberOfOrders = this.testRoutineForms.value.numberOfOrders as number;
      const address = this.testRoutineForms.value.address as Address;
      this.routingService.autoGenerateRoutes(numberOfOrders, address)
        .subscribe({
          next: (response) => {
            const cvrp_response = response as Cvrp;
            this.cvrp.emit(cvrp_response);
            this.loading = false;
          },
          error: (error) => {
            console.error('Error:', error);
            this.errorMessage = 'Ocorreu um erro interno de servidor :('; // Set error message
            this.loading = false;
          }
        });
      
    }
  }
}
