import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemDto } from '../../../../core/interfaces/item';
import { ShiftDto } from '../../../../core/interfaces/shift';
import { DietaryRestriction, dietaryRestrictionToString } from '../../../../core/enums/dietary-restrictions';
import { MatStepper } from '@angular/material/stepper';
import { OptionGroupDto } from '../../../../core/interfaces/option-group';
import { OptionGroupsService } from '../../../../core/services/option-groups/option-groups.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '../../../../core/enums/status';
import { OptionGroupUpdateOrCreateDialogComponent } from '../option-group-update-or-create-dialog/option-group-update-or-create-dialog.component';
import { Serving, servingToString } from '../../../../core/enums/serving';
import { numberToString, stringMinValidator } from '../../../../core/helpers/string-number-parser';
import { CatalogContext, catalogContextToString } from '../../../../core/enums/catalog-context';
import { WeightUnit } from '../../../../core/enums/weight-unit';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { PackagingDto } from '../../../../core/interfaces/packaging';
import { ProductPackagingDto } from '../../../../core/interfaces/product-packaging';
import { PackagingsService } from '../../../../core/services/packagings.service';
import { PackagingUpdateOrCreateDialogComponent } from '../packaging-update-or-create-dialog/packaging-update-or-create-dialog.component';
import { timeOptions } from '../../../../core/mocks/time-options';
import { ProductOptionGroupDto } from '../../../../core/interfaces/product-option-group';
import { integerValidator } from '../../../../core/helpers/integer-validator';


function validateProductPackagings(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const useLateralBag = group.get('useLateralBag')?.value;
    const productPackagings = group.get('productPackagings') as FormArray;

    if (!useLateralBag && (!productPackagings || productPackagings.length === 0 || productPackagings.invalid)) {
      return { productPackagingsRequired: true }; // Erro personalizado
    }

    return null; // Validação passou
  };
}


@Component({
  selector: 'app-item-update-or-create-dialog',
  templateUrl: './item-update-or-create-dialog.component.html',
  styleUrl: './item-update-or-create-dialog.component.scss'
})
export class ItemUpdateOrCreateDialogComponent {
  @ViewChild(MatStepper, {static : true } ) stepper!: MatStepper;
  currentStepIndex = 0; 
  detailsForm!: FormGroup;
  tablePriceForm: FormGroup;
  deliveryPriceForm: FormGroup;
  ifoodPriceForm: FormGroup;
  availabilityForm!: FormGroup;
  classificationForm!: FormGroup;
  complementsForm: FormGroup;
  packagingsForm!: FormGroup;
  optionGroups: OptionGroupDto[] = [];
  packagingOptions: PackagingDto[] = [];
  servingOptions = Object.values(Serving)
  servingToString = servingToString

  isMobile = false

  dietaryRestrictions = Object.values(DietaryRestriction);

  dietaryRestrictionToString = dietaryRestrictionToString;

  weightUnitOptins = Object.values(WeightUnit)

  timeOptions = timeOptions

  constructor(
    public dialogRef: MatDialogRef<ItemUpdateOrCreateDialogComponent>,
    public snackbar: MatSnackBar,
    public windowService: WindowWidthService,
    public dialog: MatDialog,
    public optionGroupService: OptionGroupsService,
    public packagingsService: PackagingsService,
    @Inject(MAT_DIALOG_DATA) public data: ItemDto | null
  ) {
    this.windowService.isMobile().subscribe(isMobile => this.isMobile = isMobile);


    this.detailsForm = new FormGroup({
      name: new FormControl(this.data?.product?.name ?? '', Validators.required),
      description: new FormControl(this.data?.product?.description ?? '', [Validators.required, Validators.maxLength(255)]),
      imagePath: new FormControl(this.data?.product?.imagePath ?? ''),
      serving: new FormControl(this.data?.product?.serving ?? Serving.NOT_APPLICABLE),
      weightQuantity: new FormControl(numberToString(this.data?.product?.weight?.quantity) ?? '0,00', [Validators.required, stringMinValidator(0)]),
      weightUnit: new FormControl(this.data?.product?.weight?.unit ?? WeightUnit.g, [Validators.required, stringMinValidator(0)])
    });



    this.classificationForm = new FormGroup({
      VEGETARIAN: new FormControl(this.data?.product?.dietaryRestrictions?.includes('VEGETARIAN') ?? false),
      VEGAN: new FormControl(this.data?.product?.dietaryRestrictions?.includes('VEGAN') ?? false),
      ORGANIC: new FormControl(this.data?.product?.dietaryRestrictions?.includes('ORGANIC') ?? false),
      GLUTEN_FREE: new FormControl(this.data?.product?.dietaryRestrictions?.includes('GLUTEN_FREE') ?? false),
      SUGAR_FREE: new FormControl(this.data?.product?.dietaryRestrictions?.includes('SUGAR_FREE') ?? false),
      LAC_FREE: new FormControl(this.data?.product?.dietaryRestrictions?.includes('LAC_FREE') ?? false),
      ALCOHOLIC_DRINK: new FormControl(this.data?.product?.dietaryRestrictions?.includes('ALCOHOLIC_DRINK') ?? false),
      NATURAL: new FormControl(this.data?.product?.dietaryRestrictions?.includes('NATURAL') ?? false),
      ZERO: new FormControl(this.data?.product?.dietaryRestrictions?.includes('ZERO') ?? false),
      DIET: new FormControl(this.data?.product?.dietaryRestrictions?.includes('DIET') ?? false),
    });




    

    this.packagingsForm = new FormGroup(
      {
        hasDelivery: new FormControl(true),
        useLateralBag: new FormControl(false, Validators.required),
        productPackagings: new FormArray(
          (this.data?.product?.packagings ?? []).map((packaging: ProductPackagingDto) =>
            this.createProductPackagingForm(packaging)
          )
        )
      },
      { validators: validateProductPackagings() }
    );
    


    this.tablePriceForm = this.createContextModifierForm(CatalogContext.TABLE);
    this.deliveryPriceForm = this.createContextModifierForm(CatalogContext.DELIVERY);
    this.ifoodPriceForm = this.createContextModifierForm(CatalogContext.IFOOD);


    
    this.complementsForm = new FormGroup({
      hasComplements: new FormControl(false),
      productOptionGroups: new FormArray(
        (this.data?.product?.productOptionGroups ?? []).map((group: ProductOptionGroupDto) =>
          this.createProductOptionGroupForm(group)
        )
      ),
    });
    

    this.availabilityForm = new FormGroup({
      alwaysAvailable: new FormControl(this.data?.shifts === null),
      shifts: new FormArray(
        (this.data?.shifts ?? []).map((shift) => this.createShiftGroup(shift))
      ),
    });

    this.loadOptionGroups();
    this.loadPackagings();
  }

  getCatalogContextToString(value: any): string {
    if (value in CatalogContext) {
      return catalogContextToString[value as CatalogContext];
    }
    return '';
  }
  
  getNumberToString(value: number|null|undefined, decimal:number = 2, prefix: string = '') {
    return numberToString(value, decimal, prefix)
  }

  createContextModifierForm(catalogContext: CatalogContext): FormGroup {
    const priceData = this.data?.contextModifiers.find(
      (modifier) => modifier.catalogContext === catalogContext
    );
  
    return new FormGroup({
      id: new FormControl(priceData?.id ?? null),
      status: new FormControl(priceData?.status ?? true),
      value: new FormControl(
        numberToString(priceData?.price?.value, 2, 'R$: '),
        [Validators.required, stringMinValidator(0)]
      ),
      originalValue: new FormControl(
        numberToString(priceData?.price?.originalValue, 2, 'R$: '),
        [Validators.required, stringMinValidator(0)]
      ),
    });
  }
  

  loadOptionGroups() {
    this.optionGroupService.getAll().subscribe({
      next: (response) => {''
        this.optionGroups = response;
        console.log(response)
      },

      error: (errors) => {
        this.snackbar.open(errors.error, 'fechar')
      }
    })
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



  createProductPackagingForm(productPackaging?: ProductPackagingDto): FormGroup {
    return new FormGroup({
      packaging: new FormControl(productPackaging?.packaging ?? null, Validators.required),
      quantityPerPackage: new FormControl(productPackaging?.quantityPerPackage ?? 1, [Validators.required, Validators.min(1)]),
    });
  }

  onGroupSelected(groupControl: AbstractControl, selectedGroup: any): void {
    groupControl.get('optionGroup')?.setValue(selectedGroup);
  }

  onPackagingSelected(groupControl: AbstractControl, selectedGroup: any): void {
    groupControl.get('packaging')?.setValue(selectedGroup);
  }
  

  createProductOptionGroupForm(group: any = {}): FormGroup {
    return new FormGroup({
      optionGroup: new FormControl(group?.optionGroup ?? null, Validators.required),
      min: new FormControl(group?.min ?? 1, [Validators.required, Validators.min(0), integerValidator()]),
      max: new FormControl(group?.max ?? 1, [Validators.required, Validators.min(1), integerValidator()]),
      status: new FormControl(group?.status ?? Status.AVALIABLE),
    });
  }

  onIntegerInput(control: FormControl): void {
    const value = control.value;
    if (!Number.isInteger(value)) {
      control.setValue(Math.floor(value || 0)); // Arredonda para baixo se necessário
    }
  }
  

  updateOrCreatePackaging(packaging?: PackagingDto): void {
    this.dialog.open(PackagingUpdateOrCreateDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: packaging
    }).afterClosed().subscribe(data => {
      this.loadPackagings()
    })
  }

  updateOrCreateOptionGroup(optionGroup?: OptionGroupDto): void {
    this.dialog.open(OptionGroupUpdateOrCreateDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: optionGroup
    }).afterClosed().subscribe(data => {
      this.loadOptionGroups()
    })
  }

  addPackaging(): void {
    this.productPackagingForm.push(this.createProductPackagingForm());
  }

  removePackaging(index: number): void {
    this.productPackagingForm.removeAt(index);
  }
  

  addProductOptionGroup(): void {
    this.productOptionGroupsForm.push(this.createProductOptionGroupForm());
  }

  removeOptionGroup(index: number): void {
    this.productOptionGroupsForm.removeAt(index);
  }
  
  moveOptionGroupUp(index: number): void {
    if (index > 0) {
      const groups = this.productOptionGroupsForm;
      const currentGroup = groups.at(index);
      groups.removeAt(index);
      groups.insert(index - 1, currentGroup);
    }
  }
  
  moveOptionGroupDown(index: number): void {
    if (index < this.productOptionGroupsForm.length - 1) {
      const groups = this.productOptionGroupsForm;
      const currentGroup = groups.at(index);
      groups.removeAt(index);
      groups.insert(index + 1, currentGroup);
    }
  }
  


  get dietaryRestrictionsForm() {
    return this.classificationForm.get('dietaryRestrictions') as FormArray<FormControl>;
  }

  get productOptionGroupsForm(): FormArray {
    return this.complementsForm.get('productOptionGroups') as FormArray;
  }

  get productPackagingForm(): FormArray {
    return this.packagingsForm.get('productPackagings') as FormArray;
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
        return this.packagingsForm.valid;
      case 2:
        return (
          this.tablePriceForm.valid &&
          this.deliveryPriceForm.valid &&
          this.ifoodPriceForm.valid
        );
      default:
        return true;
    }
  }

  selctImage(imagePath: string) {
    this.detailsForm.get("imagePath")?.setValue(imagePath)
  }

  onSubmit() {
    if (this.detailsForm.valid && this.availabilityForm.valid) {
      const selectedRestrictions = this.dietaryRestrictions.filter((_, index) =>
        (this.detailsForm.get('dietaryRestrictions') as FormArray).at(index).value
      );

      const itemDto = {
        ...this.data,
        product: {
          ...this.data?.product,
          name: this.detailsForm.get('name')?.value,
          description: this.detailsForm.get('description')?.value,
          dietaryRestrictions: selectedRestrictions,
          imagePath: this.detailsForm.get('imagePath')?.value,
        },
        shifts: this.shiftsForm.value,
      };
      console.log('Salvando Item:', itemDto);
      this.dialogRef.close(itemDto);
    } else {
      console.error('Formulário inválido!');
    }
  }
}
