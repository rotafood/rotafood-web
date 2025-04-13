import { Component, Inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ItemDto } from '../../../../core/interfaces/catalog/item';
import { ShiftDto } from '../../../../core/interfaces/shift';
import {
  DietaryRestriction,
  dietaryRestrictionToString
} from '../../../../core/enums/dietary-restrictions';
import { OptionGroupDto } from '../../../../core/interfaces/order/option-group';
import { OptionGroupsService } from '../../../../core/services/option-groups/option-groups.service';
import { Status } from '../../../../core/enums/status';
import { OptionGroupUpdateOrCreateDialogComponent } from '../option-group-update-or-create-dialog/option-group-update-or-create-dialog.component';
import {
  Serving,
  servingToString
} from '../../../../core/enums/serving';
import {
  numberToString,
  stringToNumber
} from '../../../../core/helpers/string-number-parser';
import {
  CatalogContext,
  catalogContextToString
} from '../../../../core/enums/catalog-context';
import { WeightUnit } from '../../../../core/enums/weight-unit';
import { WindowWidthService } from '../../../../core/services/window-width/window-width.service';
import { PackagingDto } from '../../../../core/interfaces/catalog/packaging';
import { ProductPackagingDto } from '../../../../core/interfaces/catalog/product-packaging';
import { PackagingsService } from '../../../../core/services/packagings.service';
import { PackagingUpdateOrCreateDialogComponent } from '../packaging-update-or-create-dialog/packaging-update-or-create-dialog.component';
import { timeOptions } from '../../../../core/mocks/time-options';
import { ItemOptionGroupDto } from '../../../../core/interfaces/catalog/product-option-group';
import { integerValidator } from '../../../../core/helpers/integer-validator';
import { TempletaType } from '../../../../core/enums/template-type';
import { ItemsService } from '../../../../core/services/items/items.service';
import { ContextModifierDto } from '../../../../core/interfaces/catalog/context-modifier';
import {
  PackagingType,
  packagingTypeToString
} from '../../../../core/enums/packagiong-type';
import { DefaultPackagingSelectorDialogComponent } from '../default-packaging-selector-dialog/default-packaging-selector-dialog.component';
import { OptionGroupType } from '../../../../core/enums/option-group-type';
import { validateProductPackaging } from '../../../../core/helpers/product-packging-validate';

@Component({
  selector: 'app-item-default-create-or-update-dialog',
  templateUrl: './item-default-create-or-update-dialog.component.html',
  styleUrls: ['./item-default-create-or-update-dialog.component.scss']
})
export class ItemDefaultCreateOrUpdateDialogComponent {
  @ViewChild(MatStepper, { static: true }) stepper!: MatStepper;

  currentStepIndex = 0;
  isMobile = false;
  isLoading = false;

  // Forms
  detailsForm!: FormGroup;
  contextModifiersForm!: FormGroup;
  availabilityForm!: FormGroup;
  classificationForm!: FormGroup;
  complementsForm!: FormGroup;
  packagingsForm!: FormGroup;

  // Options
  optionGroups: OptionGroupDto[] = [];
  packagingOptions: PackagingDto[] = [];
  servingOptions = Object.values(Serving);
  packagingTypeOptions = Object.values(PackagingType);
  weightUnitOptins = Object.values(WeightUnit);
  timeOptions = timeOptions;

  // Helpers for templates
  servingToString = servingToString;
  dietaryRestrictionToString = dietaryRestrictionToString;
  packagingTypeToString = packagingTypeToString;

  constructor(
    public dialogRef: MatDialogRef<ItemDefaultCreateOrUpdateDialogComponent>,
    public snackbar: MatSnackBar,
    public windowService: WindowWidthService,
    public itemsService: ItemsService,
    public dialog: MatDialog,
    public optionGroupService: OptionGroupsService,
    public packagingsService: PackagingsService,
    @Inject(MAT_DIALOG_DATA) public data: { item: ItemDto | null; categoryId: string }
  ) {
    this.windowService.isMobile().subscribe(isMobile => (this.isMobile = isMobile));

    this.detailsForm = new FormGroup({
      id: new FormControl(this.data.item?.product.id ?? undefined),
      name: new FormControl(this.data.item?.product?.name ?? '', Validators.required),
      description: new FormControl(this.data.item?.product?.description ?? '', [
        Validators.maxLength(1024)
      ]),
      imagePath: new FormControl(
        this.data.item?.product?.imagePath ?? this.data.item?.product?.imagePath
      ),
      serving: new FormControl(this.data.item?.product?.serving ?? Serving.NOT_APPLICABLE)
    });

    this.packagingsForm = new FormGroup(
      {
        packagingType: new FormControl(
          this.data.item?.product?.packagingType ?? PackagingType.PACKAGING,
          Validators.required
        ),
        productPackaging: new FormGroup({
          id: new FormControl(this.data.item?.product?.packaging?.id ?? null),
          packaging: new FormControl(
            this.data.item?.product?.packaging?.packaging ?? null,
            Validators.required
          ),
          quantityPerPackage: new FormControl(
            this.data.item?.product?.packaging?.quantityPerPackage ?? 1,
            [Validators.required, Validators.min(1)]
          )
        })
      },
      { validators: validateProductPackaging() }
    );

    this.contextModifiersForm = new FormGroup({
      contextModifiers: new FormArray(
        (this.data.item?.contextModifiers ?? this.defaultContextModifiers()).map(
          (m: ContextModifierDto) => this.createContextModifierForm(m)
        )
      )
    });

    this.complementsForm = new FormGroup({
      hasComplements: new FormControl(
        (this.data.item?.optionGroups?.length ?? 0) > 0
      ),
      ItemOptionGroups: new FormArray(
        (this.data.item?.optionGroups ?? []).map((g: ItemOptionGroupDto) =>
          this.createItemOptionGroupForm(g)
        )
      )
    });

    this.availabilityForm = new FormGroup({
      alwaysAvailable: new FormControl(
        !(this.data.item?.shifts?.length && this.data.item?.shifts?.length === 0)
      ),
      shifts: new FormArray(
        (this.data.item?.shifts ?? []).map(s => this.createShiftGroup(s))
      )
    });

    this.classificationForm = new FormGroup({});

    // Load initial data
    this.loadOptionGroups();
    this.loadPackagings();
  }

  // --- GETTERS / SETTERS ---

  getProductPackagingForm(): FormGroup {
    return this.packagingsForm.get('productPackaging') as FormGroup;
  }

  getContextModifiersFormArray(): FormArray {
    return this.contextModifiersForm.get('contextModifiers') as FormArray;
  }

  getOptionGroupsForm(): FormArray {
    return this.complementsForm.get('ItemOptionGroups') as FormArray;
  }

  getShiftsForm(): FormArray {
    return this.availabilityForm.get('shifts') as FormArray;
  }

  // --- LOAD DATA ---

  loadOptionGroups() {
    this.optionGroupService.getAll(OptionGroupType.DEFAULT).subscribe({
      next: response => {
        this.optionGroups = response;
      },
      error: errors => {
        this.snackbar.open(errors.error, 'Fechar');
      }
    });
  }

  loadPackagings() {
    this.packagingsService.getAll().subscribe({
      next: response => {
        this.packagingOptions = response;
      },
      error: errors => {
        this.snackbar.open(errors.error, 'Fechar');
      }
    });
  }

  // --- FORM BUILDERS ---

  createContextModifierForm(contextModifier?: ContextModifierDto): FormGroup {
    return new FormGroup({
      id: new FormControl(contextModifier?.id ?? undefined),
      catalogContext: new FormControl(contextModifier?.catalogContext ?? '', Validators.required),
      status: new FormControl(contextModifier?.status ?? true, Validators.required),
      price: new FormGroup({
        id: new FormControl(contextModifier?.price?.id ?? undefined),
        value: new FormControl(
          numberToString(contextModifier?.price?.value, 2, 'R$: '),
          Validators.required
        ),
        originalValue: new FormControl(
          numberToString(contextModifier?.price?.originalValue, 2, 'R$: ')
        ),
        hasDiscount: new FormControl<boolean>(
          (contextModifier?.price?.originalValue ?? 0) > 0
        )
      })
    });
  }

  defaultContextModifiers() {
    return [
      {
        catalogContext: CatalogContext.TABLE,
        status: Status.AVAILIABLE,
        price: { value: 0, originalValue: 0 }
      },
      {
        catalogContext: CatalogContext.DELIVERY,
        status: Status.AVAILIABLE,
        price: { value: 0, originalValue: 0 }
      },
      {
        catalogContext: CatalogContext.IFOOD,
        status: Status.AVAILIABLE,
        price: { value: 0, originalValue: 0 }
      }
    ];
  }

  createItemOptionGroupForm(itemOptionGroup: ItemOptionGroupDto = {} as ItemOptionGroupDto): FormGroup {
    return new FormGroup({
      id: new FormControl(itemOptionGroup.id),
      optionGroup: new FormControl(itemOptionGroup.optionGroup ?? null, Validators.required),
      index: new FormControl(itemOptionGroup.index ?? -1),
      min: new FormControl(itemOptionGroup.min ?? 1, [
        Validators.required,
        Validators.min(0),
        integerValidator()
      ]),
      max: new FormControl(itemOptionGroup.max ?? 1, [
        Validators.required,
        Validators.min(1),
        integerValidator()
      ]),
      status: new FormControl(itemOptionGroup.status ?? Status.AVAILIABLE)
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


  getCatalogContextToString(value: any): string {
    if (value in CatalogContext) {
      return catalogContextToString[value as CatalogContext];
    }
    return '';
  }

  getNumberToString(value: number | null | undefined, decimal = 2, prefix = '') {
    return numberToString(value, decimal, prefix);
  }

  onIntegerInput(control: FormControl) {
    const value = control.value;
    if (!Number.isInteger(value)) {
      control.setValue(Math.floor(value || 0));
    }
  }

  addShift() {
    this.getShiftsForm().push(this.createShiftGroup({} as ShiftDto));
  }

  removeShift(index: number): void {
    this.getShiftsForm().removeAt(index);
  }

  onGroupSelected(groupControl: AbstractControl, selectedGroup: any) {
    groupControl.get('optionGroup')?.setValue(selectedGroup);
  }

  addItemOptionGroup() {
    this.getOptionGroupsForm().push(this.createItemOptionGroupForm());
  }

  removeOptionGroup(index: number) {
    this.getOptionGroupsForm().removeAt(index);
  }

  moveOptionGroupUp(index: number) {
    if (index > 0) {
      const groups = this.getOptionGroupsForm();
      const currentGroup = groups.at(index);
      groups.removeAt(index);
      groups.insert(index - 1, currentGroup);
    }
  }

  moveOptionGroupDown(index: number) {
    if (index < this.getOptionGroupsForm().length - 1) {
      const groups = this.getOptionGroupsForm();
      const currentGroup = groups.at(index);
      groups.removeAt(index);
      groups.insert(index + 1, currentGroup);
    }
  }

  updateOrCreateOptionGroupDialog(optionGroup?: OptionGroupDto) {
    this.dialog
      .open(OptionGroupUpdateOrCreateDialogComponent, {
        width: '90vw',
        height: '90vh',
        data: optionGroup
      })
      .afterClosed()
      .subscribe((newOptionGroup?: ItemOptionGroupDto) => {
        this.loadOptionGroups();
        if (newOptionGroup) {
          const index = this.getOptionGroupsForm().controls.findIndex(control =>
            control.get('optionGroup')?.value?.id === newOptionGroup.id
          );
          if (index !== -1) {
            this.getOptionGroupsForm()
              .at(index)
              .get('optionGroup')
              ?.setValue(newOptionGroup);
          }
        }
      });
  }


  updatePackaging(packaging?: PackagingDto) {
    this.dialog
      .open(PackagingUpdateOrCreateDialogComponent, {
        width: '90vw',
        height: '90vh',
        data: packaging
      })
      .afterClosed()
      .subscribe(() => {
        this.loadPackagings();
      });
  }

  onPackagingSelected(groupControl: AbstractControl, selectedPackaging: any) {
    groupControl.get('packaging')?.setValue(selectedPackaging);
  }

  createPackagingDialog() {
    this.dialog
      .open(DefaultPackagingSelectorDialogComponent, {
        width: '90vw',
        height: '90vh',
        data: { searchTerm: 'Saco' }
      })
      .afterClosed()
      .subscribe(() => {
        this.loadPackagings();
      });
  }


  getFormControlRestriction(restriction: DietaryRestriction) {
    const control = this.classificationForm.get(restriction);
    if (!control || !(control instanceof FormControl)) {
      throw new Error(`Control for ${restriction} is not a FormControl`);
    }
    return control;
  }

  isLastStep(): boolean {
    return this.stepper?.selectedIndex === this.stepper?.steps.length - 1;
  }

  isFirstStep(): boolean {
    return this.stepper?.selectedIndex === 0;
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
      case 0:
        return this.detailsForm.valid;
      case 1:
        return this.packagingsForm.valid;
      case 2:
        return this.contextModifiersForm.valid;
      default:
        return true;
    }
  }

  selctImage(imagePath: string) {
    this.detailsForm.get('imagePath')?.setValue(imagePath);
  }


  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.detailsForm.valid && this.availabilityForm.valid) {
      const contextModifiers = this.contextModifiersForm
        .get('contextModifiers')
        ?.value.map((c: any) => ({
          ...c,
          status: c.status ? Status.AVAILIABLE : Status.UNAVAILABLE,
          price: {
            ...c.price,
            value: stringToNumber(c.price.value),
            originalValue: stringToNumber(c.price.originalValue)
          }
        }));

      const optionGroups = this.complementsForm.get('ItemOptionGroups')?.value?.map((group: any, index: number) => ({
        ...group,
        index: index
      }));

      const itemDto: ItemDto = {
        ...this.data.item,
        id: this.data.item?.id,
        index: this.data.item?.index ?? -1,
        categoryId: this.data.categoryId,
        status: Status.AVAILIABLE,
        type: TempletaType.DEFAULT,
        optionGroups: optionGroups,
        product: {
          id: this.detailsForm.get('id')?.value,
          name: this.detailsForm.get('name')?.value,
          description: this.detailsForm.get('description')?.value,
          serving: this.detailsForm.get('serving')?.value,
          imagePath: this.detailsForm.get('imagePath')?.value,
          packagingType: this.packagingsForm.get('packagingType')?.value,
          packaging:
            this.packagingsForm.get('packagingType')?.value ===
              PackagingType.PACKAGING
              ? (this.packagingsForm.get('productPackaging')?.value as ProductPackagingDto)
              : undefined
        },
        contextModifiers,
        shifts:
          this.availabilityForm.get('alwaysAvailable')?.value === true
            ? []
            : (this.availabilityForm.get('shifts')?.value as ShiftDto[])
      };

      this.itemsService.updateOrCreate(itemDto).subscribe({
        next: response => {
          this.snackbar.open(
            'O item foi criado/atualizado com sucesso!',
            'Fechar',
            { duration: 3000 }
          );
          this.dialogRef.close(response);
        },
        error: errors => {
          this.snackbar.open(
            errors.error || 'Erro ao criar/atualizar o item.',
            'Fechar'
          );
        }
      });
    } else {
      console.error('Formulário inválido!');
    }
  }
}
