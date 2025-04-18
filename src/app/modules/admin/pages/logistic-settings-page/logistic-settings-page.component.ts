import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LngLatLike } from 'maplibre-gl';
import { CurrentUserService } from '../../../../core/services/current-user/current-user.service';
import { FullMerchantDto } from '../../../../core/interfaces/merchant/full-merchant';
import { LogisticSettingDto } from '../../../../core/interfaces/merchant/merchant-logistic-setting';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';

@Component({
  selector: 'app-logistic-settings-page',
  templateUrl: './logistic-settings-page.component.html',
  styleUrls: ['./logistic-settings-page.component.scss']
})
export class LogisticSettingsPageComponent implements OnInit {
  public merchant?: FullMerchantDto;
  public center: LngLatLike = { lat: -22.553323, lng: -47.375157 };
  public isLoading = false;
  
  public logisticsForm = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    minDeliveryFee: new FormControl(5),
    deliveryFeePerKm: new FormControl(1.5),
    maxDeliveryRadiusKm: new FormControl(2.5),

    isFreeDeliveryRadiusEnabled: new FormControl(false),
    freeDeliveryRadiusKm: new FormControl(0),
  });

  public radiusOptions = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 15];

  public deliveryRadiusGeoJson: any = null;

  constructor(
    private currentUser: CurrentUserService,
    private merchantservice: MerchantService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.currentUser.getCurrentUser()) {
      this.merchantservice.get().subscribe({
        next: (response) => {
          this.merchant = response;
          
          this.center = { 
            lat: response.address.latitude as number, 
            lng: response.address.longitude as number 
          };

          if (response.logisticSetting) {
            this.logisticsForm.patchValue({
              id: response.logisticSetting?.id,
              minDeliveryFee: response.logisticSetting?.minDeliveryFee,
              deliveryFeePerKm: response.logisticSetting?.deliveryFeePerKm,
              maxDeliveryRadiusKm: response.logisticSetting?.maxDeliveryRadiusKm,

              freeDeliveryRadiusKm: response.logisticSetting?.freeDeliveryRadiusKm,
              isFreeDeliveryRadiusEnabled: 
                !!response.logisticSetting?.freeDeliveryRadiusKm &&
                response.logisticSetting?.freeDeliveryRadiusKm > 0
            });
          }
          this.updateRadius();
        }
      });
    }
  }

  updateRadius() {
    const radiusKm = this.logisticsForm.get('maxDeliveryRadiusKm')?.value || 5;
    const radiusMeters = radiusKm * 1000;

    this.deliveryRadiusGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [this.generateCircle(this.center as LngLatLike, radiusMeters)]
          }
        }
      ]
    };
  }

  generateCircle(center: LngLatLike, radius: number): number[][] {
    const points = 64; 
    const coords: number[][] = [];
    const earthRadius = 6371000; 
    const lat = (center as any).lat * Math.PI / 180;
    const lng = (center as any).lng * Math.PI / 180;

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * (2 * Math.PI);
      const dx = (radius * Math.cos(angle)) / earthRadius;
      const dy = (radius * Math.sin(angle)) / earthRadius;
      const newLat = lat + dy;
      const newLng = lng + dx / Math.cos(lat);
      coords.push([ (newLng * 180) / Math.PI, (newLat * 180) / Math.PI ]);
    }
    coords.push(coords[0]);
    return coords;
  }

  saveLogisticsSettings() {
    console.log(this.merchant, this.logisticsForm.value)
    if (!this.merchant) return;
    
    this.isLoading = true;
    const formValue = this.logisticsForm.value;

    const minDeliveryFee = formValue.isFreeDeliveryRadiusEnabled ? 0 : formValue.minDeliveryFee;
    const freeDeliveryRadiusKm = formValue.isFreeDeliveryRadiusEnabled ? formValue.freeDeliveryRadiusKm : 0;
    
    const logisticSetting: LogisticSettingDto = {
      id: formValue.id as string | undefined,
      minDeliveryFee: minDeliveryFee as number,
      deliveryFeePerKm: formValue.deliveryFeePerKm as number,
      maxDeliveryRadiusKm: formValue.maxDeliveryRadiusKm as number,
      freeDeliveryRadiusKm: freeDeliveryRadiusKm as number,
    };

    const merchantToUpdate = { ...this.merchant, logisticSetting };

    this.merchantservice.update(merchantToUpdate).subscribe({
      next: (response) => {
        if (response.logisticSetting) {
          this.logisticsForm.patchValue({
            id: response.logisticSetting?.id,
            minDeliveryFee: response.logisticSetting?.minDeliveryFee,
            deliveryFeePerKm: response.logisticSetting?.deliveryFeePerKm,
            maxDeliveryRadiusKm: response.logisticSetting?.maxDeliveryRadiusKm,
            freeDeliveryRadiusKm: response.logisticSetting?.freeDeliveryRadiusKm,
            isFreeDeliveryRadiusEnabled: 
              !!response.logisticSetting?.freeDeliveryRadiusKm &&
              response.logisticSetting?.freeDeliveryRadiusKm > 0
          });
        }
        this.snackbar.open('Dados atualizados', 'Fechar', { duration: 2000 });
        this.isLoading = false;
      },
      error: (errors) => {
        this.snackbar.open(`Erro ${errors.error.status} - ${errors.error.details}`, 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}
