import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemDto } from '../../../../core/interfaces/item';
import { ShiftDto } from '../../../../core/interfaces/shift';
import { DietaryRestriction, dietaryRestrictionToString } from '../../../../core/enums/dietary-restrictions';
import { MatStepper } from '@angular/material/stepper';
import { OptionGroupsService } from '../../../../core/services/option-groups/option-groups.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Serving } from '../../../../core/enums/serving';
import { numberToString, stringMinValidator } from '../../../../core/helpers/string-number-parser';
import { CatalogContext } from '../../../../core/enums/catalog-context';
import { WeightUnit } from '../../../../core/enums/weight-unit';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { PackagingDto } from '../../../../core/interfaces/packaging';
import { ProductPackagingDto } from '../../../../core/interfaces/product-packaging';
import { PackagingsService } from '../../../../core/services/packagings.service';
import { PackagingUpdateOrCreateDialogComponent } from '../packaging-update-or-create-dialog/packaging-update-or-create-dialog.component';
import { timeOptions } from '../../../../core/mocks/time-options';
import { DefaultProduct } from '../../../../core/interfaces/default-product';

@Component({
  selector: 'app-item-instructed-create-dialog',
  templateUrl: './item-instructed-create-dialog.component.html',
  styleUrl: './item-instructed-create-dialog.component.scss'
})
export class ItemInstructedCreateDialogComponent {
  @ViewChild(MatStepper, {static : true } ) stepper!: MatStepper;
  currentStepIndex = 0; 
  detailsForm!: FormGroup;
  tablePriceForm: FormGroup;
  deliveryPriceForm: FormGroup;
  ifoodPriceForm: FormGroup;
  priceForm: FormGroup;
  availabilityForm!: FormGroup;
  classificationForm!: FormGroup;
  packagingsForm!: FormGroup;
  packagingOptions: PackagingDto[] = [];

  isMobile = false

  dietaryRestrictions = Object.values(DietaryRestriction);

  dietaryRestrictionToString = dietaryRestrictionToString;

  weightUnitOptins = Object.values(WeightUnit)

  timeOptions = timeOptions

  constructor(
    public dialogRef: MatDialogRef<ItemInstructedCreateDialogComponent>,
    public snackbar: MatSnackBar,
    public windowService: WindowWidthService,
    public dialog: MatDialog,
    public optionGroupService: OptionGroupsService,
    public packagingsService: PackagingsService,
    @Inject(MAT_DIALOG_DATA) public data: DefaultProduct | null
  ) {
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);


    this.detailsForm = new FormGroup({
      name: new FormControl(this.data?.name ?? '', Validators.required),
      description: new FormControl(this.data?.description ?? '', [Validators.maxLength(1000)]),
      imagePath: new FormControl(this.data?.imagePath ?? ''),
      serving: new FormControl(Serving.NOT_APPLICABLE),
    });



    this.classificationForm = new FormGroup({
      VEGETARIAN: new FormControl(false),
      VEGAN: new FormControl(false),
      ORGANIC: new FormControl(false),
      GLUTEN_FREE: new FormControl(false),
      SUGAR_FREE: new FormControl(false),
      LAC_FREE: new FormControl(false),
      ALCOHOLIC_DRINK: new FormControl(false),
      NATURAL: new FormControl(false),
      ZERO: new FormControl(false),
      DIET: new FormControl(false),
    });



    this.priceForm = new FormGroup({
      id: new FormControl(null),
      value: new FormControl('0,00', [Validators.required, stringMinValidator(0)]),
      originalValue: new FormControl('0,00',  [Validators.required, stringMinValidator(0)]),
    });
    this.tablePriceForm = new FormGroup({
      id: new FormControl(null),
      status: new FormControl(true),
      value: new FormControl(
        '0,00',
        [Validators.required, stringMinValidator(0)]
      ),
      originalValue: new FormControl(
        '0,00',
        [Validators.required, stringMinValidator(0)]
      ),
    });
    this.deliveryPriceForm = new FormGroup({
      id: new FormControl(null),
      status: new FormControl(true),
      value: new FormControl(
        '0,00',
        [Validators.required, stringMinValidator(0)]
      ),
      originalValue: new FormControl(
       '0,00',
        [Validators.required, stringMinValidator(0)]
      ),
    });
    this.ifoodPriceForm = new FormGroup({
      id: new FormControl(null),
      status: new FormControl(true),
      value: new FormControl(
        '0,00',
        [Validators.required, stringMinValidator(0)]
      ),
      originalValue: new FormControl(
        '0,00',
        [Validators.required, stringMinValidator(0)]
      ),
    });


    

    this.packagingsForm = new FormGroup({
      hasDelivery: new FormControl(true),
      useLateralBag: new FormControl(false),
      productPackagings: new FormArray([])
    });    

    this.availabilityForm = new FormGroup({
      alwaysAvailable: new FormControl(true),
      shifts: new FormArray([])
  })

    this.loadPackagings();
  }


  loadPackagings() {
    this.packagingsService.getAll().subscribe({
      next: (response) => {''
        this.packagingOptions = response;
      },

      error: (errors) => {
        this.snackbar.open(errors.error, 'fechar')
      }
    })
  }

  get dietaryRestrictionsForm() {
    return this.classificationForm.get('dietaryRestrictions') as FormArray<FormControl>;
  }

  get shiftsForm() {
    return this.availabilityForm.get('shifts') as FormArray;
  }

  createShiftGroup(shift?: ShiftDto): FormGroup {
    return new FormGroup({
      startTime: new FormControl(shift?.startTime ?? '', Validators.required),
      endTime: new FormControl(shift?.endTime ?? '', Validators.required),
      monday: new FormControl(shift?.monday ?? false),
      tuesday: new FormControl(shift?.tuesday ?? false),
      wednesday: new FormControl(shift?.wednesday ?? false),
      thursday: new FormControl(shift?.thursday ?? false),
      friday: new FormControl(shift?.friday ?? false),
      saturday: new FormControl(shift?.saturday ?? false),
      sunday: new FormControl(shift?.sunday ?? false),
    });
  }

  addShift() {
    (this.availabilityForm.get('shifts') as FormArray).push(this.createShiftGroup({} as ShiftDto));
  }


  getFormControlRestriction(restriction: DietaryRestriction) {
    const control = this.classificationForm.get(restriction);
    if (!control || !(control instanceof FormControl)) {
      throw new Error(`Control for ${restriction} is not a FormControl`);
    }
    return control;
  }

  onCancel() {
    this.dialogRef.close();
  }

  isLastStep(): boolean {
    return this.stepper?.selectedIndex === this.stepper?.steps?.length - 1;
  }
  
  isFirstStep(): boolean {
    return this.stepper?.selectedIndex === 0;
  }
  

  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStepIndex++;
      this.stepper.selectedIndex = this.currentStepIndex;
    }
  }

  previousStep(): void {
    if (!this.isFirstStep()) {
      this.currentStepIndex--;
      this.stepper.selectedIndex = this.currentStepIndex;
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStepIndex) {
      case 0:
        return this.detailsForm.valid;
      case 1:
        return this.priceForm.valid;
      case 2:
        return (
          this.tablePriceForm.valid ||
          this.deliveryPriceForm.valid ||
          this.ifoodPriceForm.valid
        );
      default:
        return true;
    }
  }

  onSubmit() {
    if (this.detailsForm.valid && this.priceForm.valid && this.availabilityForm.valid) {
      const selectedRestrictions = this.dietaryRestrictions.filter((_, index) =>
        (this.detailsForm.get('dietaryRestrictions') as FormArray).at(index).value
      );

      const itemDto = {
        product: {
          name: this.detailsForm.get('name')?.value,
          description: this.detailsForm.get('description')?.value,
          dietaryRestrictions: selectedRestrictions,
          imagePath: this.detailsForm.get('imagePath')?.value,
        },
        price: {
          value: this.priceForm.get('value')?.value,
          originalValue: this.priceForm.get('originalValue')?.value,
        },
        shifts: this.shiftsForm.value,
      };
      this.dialogRef.close(itemDto);
    } else {
      console.error('Formulário inválido!');
    }
  }

  

}
