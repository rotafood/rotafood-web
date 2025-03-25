import { Component } from '@angular/core';

@Component({
  selector: 'app-configure-printer-dialog',
  templateUrl: './configure-printer-dialog.component.html',
  styleUrl: './configure-printer-dialog.component.scss'
})
export class ConfigurePrinterDialogComponent {


  copyToken() {

    const token = localStorage.getItem('ROTAFOOD_TOKEN');
  
    if (!token) {
      console.log('Nenhum token encontrado no Local Storage.');
      return;
    }
  
    navigator.clipboard.writeText(token)
      .then(() => {
        console.log('Token copiado para o clipboard!');
      })
      .catch((err) => {
        console.error('Falha ao copiar token:', err);
      });
  }

  downloadExtension() {
    
  }
    

}
