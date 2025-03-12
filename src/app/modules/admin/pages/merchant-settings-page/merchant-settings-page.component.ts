import { Component } from '@angular/core';
import { merchantTypesMock } from '../../../../core/mocks/merchant-type';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MerchantType } from '../../../../core/enums/merchant-type';
import { mockAddress } from '../../../../core/mocks/address';
import { Address } from '../../../../core/interfaces/address';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { DocumentType } from '../../../../core/enums/document-type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MerchantDto } from '../../../../core/interfaces/merchant';
import { FixMeLater } from 'angularx-qrcode';
import { ShiftDto } from '../../../../core/interfaces/shift';
import { timeOptions } from '../../../../core/mocks/time-options';

@Component({
  selector: 'app-merchant-settings-page',
  templateUrl: './merchant-settings-page.component.html',
  styleUrl: './merchant-settings-page.component.scss'
})
export class MerchantSettingsPageComponent {

  merchantTypesMock = merchantTypesMock;

  form = new FormGroup({
    id: new FormControl<string | undefined>(undefined, Validators.required),
    name: new FormControl<string>('', Validators.required),
    merchantType: new FormControl<MerchantType>(MerchantType.RESTAURANT, [Validators.required]),
    corporateName: new FormControl<string>(''),
    onlineName: new FormControl<string>('', [Validators.required, Validators.minLength(2), Validators.pattern(/^\S*$/)]),
    description: new FormControl<string>('', Validators.required),
    documentType: new FormControl<DocumentType>(DocumentType.CPF, Validators.required),
    phone: new FormControl<string>('', Validators.required),
    document: new FormControl<string>('', Validators.required),
    imagePath: new FormControl<string | undefined>(''),
    address: new FormControl<Address | null>(mockAddress, Validators.required),
    openingHours: new FormArray<FormGroup>([])
  })

  timeOptions = timeOptions;



  constructor(public merchantService: MerchantService, public snackbar: MatSnackBar){
  }

  ngOnInit() {

    
    this.merchantService.get().subscribe({
      next: response => {
        console.log(response)
        this.form.controls.id.setValue(response.id);
        this.form.controls.name.setValue(response.name);
        this.form.controls.corporateName.setValue(response.corporateName);
        this.form.controls.onlineName.setValue(response.onlineName);
        this.form.controls.description.setValue(response.description as string | null);
        this.form.controls.document.setValue(response.document);
        this.form.controls.phone.setValue(response.phone);
        this.form.controls.documentType.setValue(response.documentType);
        this.form.controls.imagePath.setValue(response.imagePath);
        const openingHoursArray = this.form.controls.openingHours as FormArray;
        openingHoursArray.clear();
        (response?.openingHours ?? []).forEach(s => {
          openingHoursArray.push(this.createShiftGroup(s)); 
        });
        if (openingHoursArray.length === 0) {
          openingHoursArray.push(this.createShiftGroup());
        }

      },
      error: errors => {
        this.snackbar.open(errors.error || 'Erro ao pegar os dados do restaurante', 'fechar');
      }
    })
  }

  createShiftGroup(shift?: ShiftDto): FormGroup {
      return new FormGroup({
        id: new FormControl(shift?.id),
        startTime: new FormControl(shift?.startTime ?? '', Validators.required),
        endTime: new FormControl(shift?.endTime ?? '', Validators.required),
        monday: new FormControl(shift?.monday ?? false),
        tuesday: new FormControl(shift?.tuesday ?? false),
        wednesday: new FormControl(shift?.wednesday ?? false),
        thursday: new FormControl(shift?.thursday ?? false),
        friday: new FormControl(shift?.friday ?? false),
        saturday: new FormControl(shift?.saturday ?? false),
        sunday: new FormControl(shift?.sunday ?? false)
      });
  }

  get openingHours(): FormArray {
    return this.form.get('openingHours') as FormArray;
  }

  addShift() {
    this.openingHours.push(this.createShiftGroup({} as ShiftDto));
  }

  removeShift(index: number) {
    this.openingHours.removeAt(index);
  }

  formatPhone(value: string): void {
    if (!value) return;
  
    const cleaned = value.replace(/\D/g, '');
  
    let formattedValue = cleaned;
  
    if (cleaned.length > 2) {
      formattedValue = `(${cleaned.slice(0, 2)}) `;
  
      if (cleaned.length > 7) {
        formattedValue += `${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
      } else if (cleaned.length > 2) {
        formattedValue += cleaned.slice(2);
      }
    }
  
    if (this.form.controls.phone.value !== formattedValue) {
      this.form.controls.phone.setValue(formattedValue, { emitEvent: false });
    }
  }



  onImageChange(imagePath: string) {
    this.form.controls.imagePath.setValue(imagePath);
  }

  saveQRCodeAsImage(qrCodeElement: FixMeLater) {
    let parentElement = qrCodeElement.qrcElement.nativeElement;
    let canvas = parentElement.querySelector('canvas');

    if (canvas) {
      const base64Image = canvas.toDataURL('image/png');
      const blob = this.convertBase64ToBlob(base64Image);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.png';
      link.click();
    } else {
      alert('Falha ao gerar o QR Code. Verifique o elemento.');
    }
  }

  private convertBase64ToBlob(base64Image: string): Blob {
    const parts = base64Image.split(';base64,');
    const imageType = parts[0].split(':')[1];
    const decodedData = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);

    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: imageType });
  }

  onSubmit() {

    this.merchantService.update(this.form.value as MerchantDto).subscribe({
      next: reponse => {
        this.snackbar.open('Dados atualizados com sucesso', 'fechar');
        console.log(reponse)

      },
      error: errors => {
        this.snackbar.open(errors.error || 'Erro ao pegar os dados do restaurante', 'fechar');
      }
    })  
  }

}
