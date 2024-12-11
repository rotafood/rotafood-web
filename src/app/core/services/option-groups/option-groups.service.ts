import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CurrentUserService } from '../current-user/current-user.service';
import { OptionGroupDto } from '../../interfaces/option-group';


@Injectable({
  providedIn: 'root'
})
export class OptionGroupsService {
  private readonly apiUrl: string = `${environment.ROTAFOOD_API}/v1/merchants`;

  constructor(
    private readonly http: HttpClient,
    private readonly currentUserService: CurrentUserService
  ) {}

  private getMerchantId(): string | undefined | null {
    return this.currentUserService.getCurrentUser()?.merchant.id;
  }

  /**
   * Get all OptionGroups for the current merchant
   */
  public getAll(): Observable<OptionGroupDto[]> {
    const merchantId = this.getMerchantId();
    if (!merchantId) {
      throw new Error('Merchant ID is not available');
    }
    const url = `${this.apiUrl}/${merchantId}/optionGroups`;
    return this.http.get<OptionGroupDto[]>(url);
  }

  /**
   * Get a specific OptionGroup by ID
   */
  public getById(optionGroupId: string): Observable<OptionGroupDto> {
    const merchantId = this.getMerchantId();
    if (!merchantId) {
      throw new Error('Merchant ID is not available');
    }
    const url = `${this.apiUrl}/${merchantId}/optionGroups/${optionGroupId}`;
    return this.http.get<OptionGroupDto>(url);
  }

  /**
   * Create or update an OptionGroup
   */
  public updateOrCreate(optionGroupDto: OptionGroupDto): Observable<OptionGroupDto> {
    const merchantId = this.getMerchantId();
    if (!merchantId) {
      throw new Error('Merchant ID is not available');
    }
    const url = `${this.apiUrl}/${merchantId}/optionGroups`;
    return this.http.put<OptionGroupDto>(url, optionGroupDto);
  }

  /**
   * Delete an OptionGroup by ID
   */
  public delete(optionGroupId: string): Observable<void> {
    const merchantId = this.getMerchantId();
    if (!merchantId) {
      throw new Error('Merchant ID is not available');
    }
    const url = `${this.apiUrl}/${merchantId}/optionGroups/${optionGroupId}`;
    return this.http.delete<void>(url);
  }
}
