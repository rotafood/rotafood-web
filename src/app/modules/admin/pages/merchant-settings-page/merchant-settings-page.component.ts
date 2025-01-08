import { Component } from '@angular/core';
import { merchantTypesMock } from '../../../../core/mocks/merchant-type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MerchantType } from '../../../../core/enums/merchant-type';
import { mockAddress } from '../../../../core/mocks/address';
import { Address } from '../../../../core/interfaces/address';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { DocumentType } from '../../../../core/enums/document-type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MerchantDto } from '../../../../core/interfaces/merchant';
import { FixMeLater } from 'angularx-qrcode';

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
    corporateName: new FormControl<string>('', Validators.required),
    onlineName: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl<string>('', Validators.required),
    documentType: new FormControl<DocumentType>(DocumentType.CPF, Validators.required),
    document: new FormControl<string>('', Validators.required),
    imagePath: new FormControl<string | undefined>(''),
    address: new FormControl<Address | null>(mockAddress, Validators.required)
  })


  constructor(public merchantService: MerchantService, public snackbar: MatSnackBar){
  }

  ngOnInit() {
    this.merchantService.get().subscribe({
      next: reponse => {
        console.log(reponse)
        this.form.controls.id.setValue(reponse.id);
        this.form.controls.name.setValue(reponse.name);
        this.form.controls.corporateName.setValue(reponse.corporateName);
        this.form.controls.onlineName.setValue(reponse.onlineName);
        this.form.controls.description.setValue(reponse.description as string | null);
        this.form.controls.document.setValue(reponse.document);
        this.form.controls.documentType.setValue(reponse.documentType);
        this.form.controls.imagePath.setValue(reponse.imagePath);

      },
      error: errors => {
        this.snackbar.open(errors.error || 'Erro ao pegar os dados do restaurante', 'fechar');
      }
    })
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
      link.download = 'qrcode.png'; // Nome do arquivo
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
