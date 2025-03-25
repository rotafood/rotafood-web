import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressDto } from '../../../../../core/interfaces/address';
import { mockAddress } from '../../../../../core/mocks/address';
import { RoutineTestService } from '../../../../../core/services/routine-test/routine-test.service';
import { Vrp } from '../../../../../core/interfaces/vrp';
import { IpService } from '../../../../../core/services/ip-service/ip-service.service';

@Component({
  selector: 'app-vrp-test-form',
  templateUrl: './vrp-test-form.component.html',
  styleUrl: './vrp-test-form.component.scss'
})
export class VrpTestFormComponent {

  public testRoutineForms = new FormGroup({
    numberOfOrders: new FormControl<number>(30, [Validators.required, Validators.min(5), Validators.max(500)]),
    address: new FormControl<AddressDto|null>(mockAddress)
  });

  public loading = false;
  public errorMessage: string | null = null;
  @Output() 
  public cvrp = new EventEmitter<Vrp>();


  constructor(
    public routingService: RoutineTestService,
    public ipService: IpService,
  ) {}
  
  
  onSubmit() {
    this.errorMessage = null;
    this.loading = true;
  
    const numberOfOrders = this.testRoutineForms.value.numberOfOrders as number;
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const address: AddressDto = {
            id: null,
            state: 'Estado Teste',
            city: 'Limeira',
            country: 'Brasil',
            streetName: 'Rua Exemplo',
            formattedAddress: 'Rua Exemplo, Bairro Teste, Cidade Teste - Estado Teste',
            streetNumber: '123',
            postalCode: '00000000',
            neighborhood: 'Bairro Teste',
            complement: '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
  
          this.testRoutineForms.controls.address.setValue(address);
  
          this.routingService.autoGenerateRoutes(numberOfOrders, address).subscribe({
            next: (response) => {
              this.cvrp.emit(response);
              this.loading = false;
            },
            error: (error) => {
              console.error(error);
              this.errorMessage = 'Ocorreu um erro interno de servidor :(';
              this.loading = false;
            },
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          this.errorMessage = 'Não foi possível obter sua localização.';
          this.loading = false;
        }
      );
    } else {
      this.errorMessage = 'Geolocalização não suportada no seu navegador.';
      this.loading = false;
    }
  }
}  