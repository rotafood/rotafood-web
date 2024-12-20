import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemDto } from '../../../../core/interfaces/item';
import { ShiftDto } from '../../../../core/interfaces/shift';
import { MatStepper } from '@angular/material/stepper';
import { Status } from '../../../../core/enums/status';
import { numberToString } from '../../../../core/helpers/string-number-parser';
import { CatalogContext, catalogContextToString } from '../../../../core/enums/catalog-context';
import { ProductPackagingDto } from '../../../../core/interfaces/product-packaging';
import { timeOptions } from '../../../../core/mocks/time-options';
import { ContextModifierDto } from '../../../../core/interfaces/context-modifier';
import { PackagingType, packagingTypeToString } from '../../../../core/enums/packagiong-type';
import { OptionGroupType } from '../../../../core/enums/option-group-type';
import { OptionDto } from '../../../../core/interfaces/option';
import { ProductOptionDto } from '../../../../core/interfaces/product-option';
import { PackagingDto } from '../../../../core/interfaces/packaging';
import { PackagingUpdateOrCreateDialogComponent } from '../packaging-update-or-create-dialog/packaging-update-or-create-dialog.component';
import { PackagingsService } from '../../../../core/services/packagings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { TempletaType } from '../../../../core/enums/template-type';
import { ProductOptionGroupDto } from '../../../../core/interfaces/product-option-group';
import { DefaultPackagingSelectorDialogComponent } from '../default-packaging-selector-dialog/default-packaging-selector-dialog.component';

function validateProductPackagings(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const packagingType = group.get('packagingType')?.value;
    const productPackagings = group.get('productPackagings') as FormArray;
    if (packagingType === 'PACKAGING' && productPackagings.length === 0) return { invalidSideBag: true };
    return null;
  };
}

@Component({
  selector: 'app-item-pizza-create-or-update-dialog',
  templateUrl: './item-pizza-create-or-update-dialog.component.html',
  styleUrl: './item-pizza-create-or-update-dialog.component.scss'
})
export class ItemPizzaCreateOrUpdateDialogComponent {
  currentStepIndex = 0;
  isMobile = false;
  timeOptions = timeOptions;
  packagingTypeOptions = Object.values(PackagingType);
  packagingTypeToString = packagingTypeToString;
  packagingOptions: PackagingDto[] = [];

  @ViewChild(MatStepper, { static: true }) stepper!: MatStepper;


  itemForm = new FormGroup({
    name: new FormControl('Pizza', Validators.required),
    imagePath: new FormControl('')
  });

  sizesForm = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl(''),
    status: new FormControl<Status>(Status.AVALIABLE),
    optionGroupType: new FormControl<OptionGroupType>(OptionGroupType.SIZE),
    options: new FormArray<any>([])
  });

  crustsForm = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl(''),
    status: new FormControl<Status>(Status.AVALIABLE),
    optionGroupType: new FormControl<OptionGroupType>(OptionGroupType.CRUST),
    options: new FormArray<any>([])
  });

  edgesForm = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl(''),
    status: new FormControl<Status>(Status.AVALIABLE),
    optionGroupType: new FormControl<OptionGroupType>(OptionGroupType.EDGE),
    options: new FormArray<any>([])
  });

  packagingsForm = new FormGroup({
    packagingType: new FormControl(PackagingType.PACKAGING, Validators.required),
    productPackagings: new FormArray<any>([])
  });

  availabilityForm = new FormGroup({
    alwaysAvailable: new FormControl(true),
    shifts: new FormArray<any>([])
  });

  constructor(
    public dialogRef: MatDialogRef<ItemPizzaCreateOrUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: ItemDto | null; categoryId: string },
    public dialog: MatDialog,
    public packagingsService: PackagingsService,
    public snackbar: MatSnackBar,
    public windowService: WindowWidthService,




  ) {

    

    this.windowService.isMobile().subscribe(isMobile => (this.isMobile = isMobile));


    this.packagingsForm = new FormGroup(
      {
        packagingType: new FormControl(this.data.item?.product?.packagingType ?? PackagingType.PACKAGING, Validators.required),
        productPackagings: new FormArray(
          (this.data.item?.product?.packagings ?? []).map((p: ProductPackagingDto) => this.createProductPackagingForm(p))
        )
      },
      { validators: validateProductPackagings() }
    );

    this.availabilityForm = new FormGroup({
      alwaysAvailable: new FormControl(!(this.data.item?.shifts?.length && this.data.item?.shifts?.length === 0)),
      shifts: new FormArray((this.data.item?.shifts ?? []).map(s => this.createShiftGroup(s)))
    });

    const pizzaSize = this.data.item?.product?.optionGroups?.find(og => og.optionGroup.optionGroupType === OptionGroupType.SIZE);

    this.sizesForm = new FormGroup({
      id: new FormControl(pizzaSize?.optionGroup?.id ?? null),
      name: new FormControl(pizzaSize?.optionGroup?.name ?? null),
      status: new FormControl<Status>(pizzaSize?.optionGroup?.status ?? Status.AVALIABLE),
      optionGroupType: new FormControl<OptionGroupType>(OptionGroupType.SIZE),
      options: new FormArray<any>((pizzaSize?.optionGroup?.options ?? this.defaultSizeOptions()).map(o => this.createOptionForm(o)))
    })

    const pizzaCrusts = this.data.item?.product?.optionGroups?.find(og => og.optionGroup.optionGroupType === OptionGroupType.CRUST);

    this.crustsForm = new FormGroup({
      id: new FormControl(pizzaCrusts?.optionGroup?.id ?? null),
      name: new FormControl(pizzaCrusts?.optionGroup?.name ?? null),
      status: new FormControl<Status>(pizzaCrusts?.optionGroup?.status ?? Status.AVALIABLE),
      optionGroupType: new FormControl<OptionGroupType>(OptionGroupType.CRUST),
      options: new FormArray<any>((pizzaCrusts?.optionGroup?.options ?? this.defaultCrushOptions()).map(o => this.createOptionForm(o)))
    })

    const pizzaEdge = this.data.item?.product?.optionGroups?.find(og => og.optionGroup.optionGroupType === OptionGroupType.EDGE);

    this.edgesForm = new FormGroup({
      id: new FormControl(pizzaEdge?.optionGroup?.id ?? null),
      name: new FormControl(pizzaEdge?.optionGroup?.name ?? null),
      status: new FormControl<Status>(pizzaEdge?.optionGroup?.status ?? Status.AVALIABLE),
      optionGroupType: new FormControl<OptionGroupType>(OptionGroupType.EDGE),
      options: new FormArray<any>((pizzaEdge?.optionGroup?.options ?? this.defaultCrushOptions()).map(o => this.createOptionForm(o)))
    })

    this.loadPackagings()
  }

  defaultSizeOptions(): OptionDto[] {
    const option1: OptionDto = {
      id: undefined,
      status: Status.AVALIABLE,
      index: 0,
      contextModifiers: this.defaultContextModifiers(),
      fractions: [1],
      product: {
        ...this.defaultProductOption(),
        name: 'Pequena',
        quantity: 4
      }
    };
  
    const option2: OptionDto = {
      id: undefined,
      status: Status.AVALIABLE,
      index: 1,
      contextModifiers: this.defaultContextModifiers(),
      fractions: [1, 2],
      product: {
        ...this.defaultProductOption(),
        name: 'Grande',
        quantity: 8 
      }
    };
  
    return [option1, option2];
  }

  defaultCrushOptions(): OptionDto[] {
    const option1: OptionDto = {
      id: undefined,
      status: Status.AVALIABLE,
      index: 0,
      contextModifiers: this.defaultContextModifiers(),
      product: {
        ...this.defaultProductOption(),
        name: 'Massa Tradicional'
      }
    };
    return [option1];
  }

  defaultEdgeOptions(): OptionDto[] {
    const option1: OptionDto = {
      id: undefined,
      status: Status.AVALIABLE,
      index: 0,
      contextModifiers: this.defaultContextModifiers(),
      product: {
        ...this.defaultProductOption(),
        name: 'Borda Tradicional'
      }
    };

    return [option1];
  }
  
  

  createOptionForm(optionDto?: OptionDto, defaultFractions: number[] | null = null) {
    return new FormGroup({
      id: new FormControl(optionDto?.id),
      index: new FormControl(optionDto?.index ?? null),
      status: new FormControl<Status>(optionDto?.status ?? Status.AVALIABLE),
      contextModifiers: new FormArray(
        (optionDto?.contextModifiers ?? this.defaultContextModifiers()).map((m: ContextModifierDto) => this.createContextModifierForm(m))
      ),
      product: this.createProductOptionForm(optionDto?.product ?? this.defaultProductOption()),
      fractions: new FormControl<number[] | null>(optionDto?.fractions ?? defaultFractions)
    })
  }

  defaultProductOption(): ProductOptionDto {
    return {
      id: undefined,
      name: '',
      description: '',
      optionGroupId: undefined,
      optionId: undefined,
      imagePath: undefined,
      quantity: undefined,
      packagingType: undefined
    };
  }
  
  createProductOptionForm(productOption?: ProductOptionDto): FormGroup {
    const prodOpt = productOption ?? this.defaultProductOption();
    return new FormGroup({
      id: new FormControl(prodOpt.id),
      name: new FormControl(prodOpt.name, Validators.required),
      description: new FormControl(prodOpt.description),
      optionId: new FormControl(prodOpt.optionId),
      imagePath: new FormControl(prodOpt.imagePath ?? null),
      quantity: new FormControl(prodOpt.quantity ?? 1, [Validators.required]),
      packagingType: new FormControl(prodOpt.packagingType)
    });
  }
  

  createProductPackagingForm(productPackaging?: ProductPackagingDto): FormGroup {
    return new FormGroup({
      id: new FormControl(productPackaging?.id ?? null),
      packaging: new FormControl(productPackaging?.packaging ?? null, Validators.required),
      quantityPerPackage: new FormControl(productPackaging?.quantityPerPackage ?? 1, [Validators.required, Validators.min(1)])
    });
  }

  createShiftGroup(shift?: ShiftDto): FormGroup {
    return new FormGroup({
      id: new FormControl(shift?.id),
      startTime: new FormControl(shift?.startTime ?? '', Validators.required),
      endTime: new FormControl(shift?.endTime ?? '', Validators.required),
      monday: new FormControl(shift?.monday ?? false),
      tuesday: new FormControl(shift?.tuesday ?? false),
      wednesday: new FormControl(shift?.wednesday ?? false),
      thursday: new FormControl(shift?.thursday ?? false),
      friday: new FormControl(shift?.friday ?? false),
      saturday: new FormControl(shift?.saturday ?? false),
      sunday: new FormControl(shift?.sunday ?? false)
    });
  }

  defaultContextModifiers() {
    return [
      { catalogContext: CatalogContext.TABLE, status: Status.AVALIABLE, price: { value: 0, originalValue: 0 } },
      { catalogContext: CatalogContext.DELIVERY, status: Status.AVALIABLE, price: { value: 0, originalValue: 0 } },
      { catalogContext: CatalogContext.IFOOD, status: Status.AVALIABLE, price: { value: 0, originalValue: 0 } }
    ];
  }

  createContextModifierForm(contextModifier?: ContextModifierDto): FormGroup {
    return new FormGroup({
      id: new FormControl(contextModifier?.id ?? undefined),
      catalogContext: new FormControl(contextModifier?.catalogContext ?? '', Validators.required),
      status: new FormControl(contextModifier?.status !== Status.UNAVAILABLE, Validators.required),
      price: new FormGroup({
        id: new FormControl(contextModifier?.price?.id ?? undefined),
        value: new FormControl(numberToString(contextModifier?.price?.value, 2, 'R$: '), Validators.required),
        originalValue: new FormControl(numberToString(contextModifier?.price?.originalValue, 2, 'R$: '))
      })
    });
  }

  getCatalogContextToString(value: any): string {
    if (value in CatalogContext) return catalogContextToString[value as CatalogContext];
    return '';
  }


  addSize() {
    const group = new FormGroup({
      name: new FormControl('', Validators.required),
      image: new FormControl(null),
      qtdPedacos: new FormControl(8, Validators.required),
      qtdSabores: new FormControl(2, Validators.required)
    });
    this.sizesForm.controls.options.push(group);
  }
  removeSize(i: number) {
    this.sizesForm.controls.options.removeAt(i);
  }

  onSizeImageChange(i: number, imagePath: string) {
    this.sizesForm.controls.options.at(i).get('product.image')?.setValue(imagePath);
  }


  addCrust() {
    const crustForm = this.createEdgeOrCrust();
    this.crustsForm.controls.options.push(crustForm);
  }
  
  removeCrust(index: number) {
    this.crustsForm.controls.options.removeAt(index);
  }
  
  getCrustContextArray(index: number): FormArray {
    return this.crustsForm.controls.options.at(index).get('contextModifiers') as FormArray;
  }

  onCrustImageChange(i: number, imagePath: string) {
    this.crustsForm.controls.options.at(i).get('product.image')?.setValue(imagePath);
  }
  

  addEdge() {
    const edgeForm = this.createEdgeOrCrust();
    this.edgesForm.controls.options.push(edgeForm);
  }
  
  removeEdge(index: number) {
    this.edgesForm.controls.options.removeAt(index);
  }
  
  getBordaContextArray(index: number): FormArray {
    return this.edgesForm.controls.options.at(index).get('contextModifiers') as FormArray;
  }

  onEdgeImageChange(i: number, imagePath: string) {
    this.edgesForm.controls.options.at(i).get('product.image')?.setValue(imagePath);
  }

  onItemImageChange(imagePath: string){
    this.itemForm.controls.imagePath.setValue(imagePath)
  }
  
  createEdgeOrCrust(): FormGroup {
    return new FormGroup({
      product: this.createProductOptionForm(),
      contextModifiers: new FormArray(
        this.defaultContextModifiers().map(cm => this.createContextModifierForm(cm))
      )
    });
  }






  addPackaging() {
    this.packagingsForm.controls.productPackagings.push(this.createProductPackagingForm());
  }

  removePackaging(index: number) {
    this.packagingsForm.controls.productPackagings.removeAt(index);
  }

  loadPackagings() {
    this.packagingsService.getAll().subscribe({
      next: response => {
        this.packagingOptions = response;
      },
      error: errors => {
        this.snackbar.open(errors.error, 'fechar');
      }
    });
  }

  onPackagingSelected(groupControl: AbstractControl, selectedGroup: any) {
    groupControl.get('packaging')?.setValue(selectedGroup);
  }

  updateOrCreatePackaging(packaging?: PackagingDto) {
    this.dialog.open(DefaultPackagingSelectorDialogComponent, { width: '90vw', height: '90vh', data: packaging })
      .afterClosed().subscribe(() => {
        this.loadPackagings()
        this.packagingsForm.controls.productPackagings.setValue([])
      
      });
  }



  get shiftsForm() {
    return this.availabilityForm.get('shifts') as FormArray;
  }
  addShift() {
    const group = new FormGroup({
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
      monday: new FormControl(false),
      tuesday: new FormControl(false),
      wednesday: new FormControl(false),
      thursday: new FormControl(false),
      friday: new FormControl(false),
      saturday: new FormControl(false),
      sunday: new FormControl(false)
    });
    this.shiftsForm.push(group);
  }

  onCancel() {
    this.dialogRef.close();
  }

  isLastStep(): boolean {
    return this.stepper?.selectedIndex === this.stepper?.steps?.length - 1;
  }

  isFirstStep(): boolean {
    return this.currentStepIndex === 0;
  }

  nextStep() {
    if (this.isCurrentStepValid()) {
      this.stepper.next();
    }
  }

  
  
  previousStep() {
    this.stepper.previous();
  }


  isCurrentStepValid(): boolean {

    switch (this.currentStepIndex) {
      case 0: return this.itemForm.valid;
      case 1: return this.sizesForm.valid;
      case 2: return this.crustsForm.valid;
      case 3: return this.edgesForm.valid;
      case 4: return this.packagingsForm.valid;
      case 5: return this.availabilityForm.valid;
      default: return true;
    }
  }

  public defaultToppings() {
    const tanana: ProductOptionGroupDto = {
      status: Status.AVALIABLE,
      min: 1,
      max: 2,
      optionGroup: {
        name: 'Sabores',
        status: Status.AVALIABLE,
        optionGroupType: OptionGroupType.DEFAULT,
        options: []
      }
    }
    return {

    }
  }

  onSubmit() {
    if (
      this.itemForm.valid && 
      this.sizesForm.valid && 
      this.crustsForm.valid && 
      this.edgesForm.valid && 
      this.packagingsForm.valid && 
      this.availabilityForm.valid
    ) {
      const optionGroupDtos = [
        {
          ...this.sizesForm.value
        },
        {
          ...this.crustsForm.value
        },
        {
          ...this.edgesForm.value
        },
        {
          ...this.defaultToppings()
        }
      ]
      const itemDto = {
        ...this.data.item,
        status: Status.AVALIABLE,
        type: TempletaType.PIZZA,
        contextModifiers: [this.defaultContextModifiers()],
        product: {
          ...this.data.item?.product,
          optionGroups: optionGroupDtos
        },
        shifts: this.shiftsForm.value,
        packagings: this.packagingsForm.value
      }
      console.log(itemDto)
      this.dialogRef.close();
    } else {
      console.error('Formulário inválido!');
    }
  }
}