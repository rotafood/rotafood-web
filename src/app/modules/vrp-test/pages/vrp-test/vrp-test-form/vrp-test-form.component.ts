import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from '../../../../../core/interfaces/address';
import { mockAddress } from '../../../../../core/mocks/address';
import { RoutineTestService } from '../../../../../core/services/routine-test/routine-test.service';
import { Vrp } from '../../../../../core/interfaces/vrp';
import { IpService } from '../../../../../core/services/ip-service/ip-service.service';
import { LogService } from '../../../../../core/services/log/log.service';

@Component({
  selector: 'app-vrp-test-form',
  templateUrl: './vrp-test-form.component.html',
  styleUrl: './vrp-test-form.component.scss'
})
export class VrpTestFormComponent {

  public testRoutineForms = new FormGroup({
    numberOfOrders: new FormControl<number>(30, [Validators.required, Validators.min(5), Validators.max(500)]),
    address: new FormControl<Address|null>(mockAddress)
  });

  public loading = false;
  public errorMessage: string | null = null;
  @Output() 
  public cvrp = new EventEmitter<Vrp>();


  constructor(
    public routingService: RoutineTestService,
    public ipService: IpService,
    private readonly logService: LogService
  ) {}
  
  
  onSubmit() {
    this.logService.postLog(new Date(), window.location.href)
    this.errorMessage = null; 
      this.loading = true;
      const numberOfOrders = this.testRoutineForms.value.numberOfOrders as number;
      const address = this.testRoutineForms.value.address as Address;
      this.routingService.autoGenerateRoutes(numberOfOrders, address)
        .subscribe({
          next: (response) => {
            const cvrpResponse = response;
            this.cvrp.emit(cvrpResponse);
            this.loading = false;
          },
          error: (error) => {
            console.error(error);
            this.errorMessage = 'Ocorreu um erro interno de servidor :(';
            this.loading = false;
          }
        });
    

    
  }
}
