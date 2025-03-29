import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';

@Component({
  selector: 'app-subscription-page',
  templateUrl: './subscription-page.component.html',
  styleUrl: './subscription-page.component.scss'
})
export class SubscriptionPageComponent {
  isTrialExpired = false;
  daysToFinishFreeTrial = 0;
  stripeLink = environment.STRIPE_PRODUCT_LINK;

  constructor(private merchantService: MerchantService) {}

  ngOnInit(): void {
    this.merchantService.get().subscribe((merchant) => {
      if (merchant?.createdAt) {
        const createdAt = new Date(merchant.createdAt);
        const hoje = new Date();

        const msPorDia = 1000 * 60 * 60 * 24;
        const diffInMs = hoje.getTime() - createdAt.getTime();
        const diffInDias = Math.floor(diffInMs / msPorDia);

        this.isTrialExpired = diffInDias > 30;
        this.daysToFinishFreeTrial = Math.max(0, 30 - diffInDias);
      }
    });
  }
}
