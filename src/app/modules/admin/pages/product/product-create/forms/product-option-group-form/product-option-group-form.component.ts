import { Component } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { ProductOptionGroupsService } from '../../../../../../../core/services/product/product-option-groups/product-option-groups.service';

@Component({
  selector: 'app-product-option-group-form',
  templateUrl: './product-option-group-form.component.html',
  styleUrl: './product-option-group-form.component.scss'
})
export class ProductOptionGroupFormComponent {

  constructor( public productOptionForm: ProductOptionGroupsService) {}


  addOptionGroup() {
    const newGroup = this.productOptionForm.createOptionGroup();
    this.productOptionForm.addOptionGroup(newGroup);
  }

  addOption(groupIndex: number) {
    const newOption = this.productOptionForm.createOption();
    this.productOptionForm.addOption(groupIndex, newOption);
  }

  getOptions(group: AbstractControl): FormArray {
    return group.get('options') as FormArray;
  }

}
