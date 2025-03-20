import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MerchantOrderEstimateDto } from '../../../../core/interfaces/merchant-order-estimate';
import { LogisticService } from '../../../../core/services/logistic.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-merchant-order-estimate-dialog',
  templateUrl: './merchant-order-estimate-dialog.component.html',
  styleUrls: ['./merchant-order-estimate-dialog.component.scss']
})
export class MerchantOrderEstimateDialogComponent implements OnInit {
  isLoading = false
  estimateForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<MerchantOrderEstimateDialogComponent>,
    private logisticService: LogisticService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: MerchantOrderEstimateDto
  ) {}

  ngOnInit(): void {
    this.estimateForm = new FormGroup({
      id: new FormControl(this.data?.id),
      pickupMinMinutes: new FormControl(this.data?.pickupMinMinutes ?? 10, [Validators.required, Validators.min(1)]),
      pickupMaxMinutes: new FormControl(this.data?.pickupMaxMinutes ?? 30, [Validators.required, Validators.min(1)]),
      deliveryMinMinutes: new FormControl(this.data?.deliveryMinMinutes ?? 20, [Validators.required, Validators.min(1)]),
      deliveryMaxMinutes: new FormControl(this.data?.deliveryMaxMinutes ?? 45, [Validators.required, Validators.min(1)]),
      merchantId: new FormControl(this.data?.merchantId)
    });
  }

  onSave(): void {
    if (this.estimateForm.valid) {
      this.isLoading = true
      this.logisticService.createOrUpdateMerchantOrderEstimates(this.estimateForm.value as MerchantOrderEstimateDto).subscribe({
        next: (response) => {
          this.dialogRef.close(response);
          this.isLoading = false
        },
        error: (errors) => {
          this.snackbar.open(`Erro ${errors.error.status} - ${errors.error.details}`, "Fechar", {duration: 3000})
          this.isLoading = false
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
