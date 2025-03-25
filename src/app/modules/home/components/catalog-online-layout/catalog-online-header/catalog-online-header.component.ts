import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShowCatalogOnlineSideNavService } from '../../../../../core/services/show-catalog-online-side-nav.service';
import { FullMerchantDto } from '../../../../../core/interfaces/full-merchant';
import { ShiftDto } from '../../../../../core/interfaces/shift';
import { getHasOpened } from '../../../../../core/helpers/get-has-opened';

@Component({
  selector: 'app-catalog-online-header',
  templateUrl: './catalog-online-header.component.html',
  styleUrl: './catalog-online-header.component.scss'
})
export class CatalogOnlineHeaderComponent implements OnChanges {

  @Input()
  merchant: FullMerchantDto | undefined = undefined;

  hasOpened = false;

  constructor(
    public sideNavService: ShowCatalogOnlineSideNavService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['merchant'] && this.merchant) {
      this.hasOpened = getHasOpened(this.merchant);
    }
  }

  toggleSideNav() {
    this.sideNavService.toggleNav();
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
  
    return shifts
      .map(shift => {
        const days = (Object.keys(daysMap) as Array<keyof typeof daysMap>)
          .filter(day => shift[day])
          .map(day => daysMap[day]);
  
        if (days.length) {
          return {
            days: days.join(", "),
            startTime: shift.startTime,
            endTime: shift.endTime
          };
        }
        return null;
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }
}
