import { Component, Input } from '@angular/core';
import { WindowWidthService } from '../../../../../core/services/window-width/window-width.service';
import { ShowCatalogOnlineSideNavService } from '../../../../../core/services/show-catalog-online-side-nav.service';
import { MerchantDto } from '../../../../../core/interfaces/merchant';
import { ShiftDto } from '../../../../../core/interfaces/shift';

@Component({
  selector: 'app-catalog-online-header',
  templateUrl: './catalog-online-header.component.html',
  styleUrl: './catalog-online-header.component.scss'
})
export class CatalogOnlineHeaderComponent {

  @Input()
  merchant: MerchantDto | undefined = undefined

  constructor(
    public sideNavService: ShowCatalogOnlineSideNavService,
    public windowWidth: WindowWidthService
    ) {

    }
  toggleSideNav() {
    this.sideNavService.toggleNav();
  }

  getHasOpened(): boolean {
    if (!this.merchant?.lastOpenedUtc) {
      return false;
    }
  
    const lastOpenedUTC = new Date(this.merchant.lastOpenedUtc).getTime();
  
    const nowUTC = Date.now();
  
    return (nowUTC - lastOpenedUTC) <= 30000;
  }

  getFormattedOpeningHours(shifts: ShiftDto[]) {


    const daysMap = {
      monday: "Segunda",
      tuesday: "Terça",
      wednesday: "Quarta",
      thursday: "Quinta",
      friday: "Sexta",
      saturday: "Sábado",
      sunday: "Domingo"
    } as const;
  
    const result: { days: string, startTime: string, endTime: string }[] = [];
  
    shifts.forEach(shift => {
      const days = (Object.keys(daysMap) as Array<keyof typeof daysMap>) 
        .filter(day => shift[day]) 
        .map(day => daysMap[day]);
  
      if (days.length) {
        result.push({
          days: days.join(", "),
          startTime: shift.startTime,
          endTime: shift.endTime
        });
      }
    });

    console.log(result)
  
    return result;
  }
  
}
