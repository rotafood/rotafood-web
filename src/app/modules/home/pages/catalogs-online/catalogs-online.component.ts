import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogOnlineService } from '../../../../core/services/catalog-online.service';
import { ItemDto } from '../../../../core/interfaces/catalog/item';
import { CatalogContext } from '../../../../core/enums/catalog-context';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddOrderItemDialogComponent } from '../../components/add-order-item-dialog/add-order-item-dialog.component';
import { ShowCatalogOnlineSideNavService } from '../../../../core/services/show-catalog-online-side-nav.service';
import { FullMerchantDto } from '../../../../core/interfaces/merchant/full-merchant';
import { ShiftDto } from '../../../../core/interfaces/shift';

@Component({
  selector: 'app-catalogs-online',
  templateUrl: './catalogs-online.component.html',
  styleUrl: './catalogs-online.component.scss'
})
export class CatalogsOnlineComponent implements OnInit {
  merchant: FullMerchantDto | undefined = undefined;
  isMobile = false;


  constructor(
    private catalogOnlineService: CatalogOnlineService,
    private route: ActivatedRoute,
    private windowService: WindowWidthService,
    private router: Router,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);
    this.route.paramMap.subscribe(params => {
      const onlineName = params.get('onlineName');
      if (onlineName) {
        this.fetchMerchant(onlineName);
      }
    });
  }

  private fetchMerchant(onlineName: string): void {
    this.catalogOnlineService.getMerchantByOnlineName(onlineName).subscribe({
      next: (response) => {
        this.merchant = response;      
      },
      error: (errors) => {
        this.snackbar.open('Resurante não encontrado :(', 'fechar');
      }
    });
  }

  navigateTo(route: string): void {
    const currentUrl = this.router.url.replace(/\/$/, '');
    this.router.navigate([`${currentUrl}/${route}`]);
  }

  getFormattedOpeningHours(shifts: ShiftDto[]): { days: string, startTime: string, endTime: string }[] {
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
  
    return result;
  }
  
}
