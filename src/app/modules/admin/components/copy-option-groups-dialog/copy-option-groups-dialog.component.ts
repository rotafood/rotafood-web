import { Component, Inject, OnInit } from '@angular/core';
import { ItemDto } from '../../../../core/interfaces/catalog/item';
import { OptionGroupDto } from '../../../../core/interfaces/order/option-group';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemOptionGroupDto } from '../../../../core/interfaces/catalog/product-option-group';
import { ItemsService } from '../../../../core/services/items/items.service';
import { OptionGroupsService } from '../../../../core/services/option-groups/option-groups.service';
import { OptionGroupType } from '../../../../core/enums/option-group-type';
import { Status } from '../../../../core/enums/status';

@Component({
  selector: 'app-copy-option-groups-dialog',
  templateUrl: './copy-option-groups-dialog.component.html',
  styleUrl: './copy-option-groups-dialog.component.scss'
})
export class CopyOptionGroupsDialogComponent implements OnInit {
  selectedTab = 0;
  itemsWithGroups: ItemDto[] = [];
  optionGroups: OptionGroupDto[] = [];

  selectedItem?: ItemDto;
  selectedGroup?: OptionGroupDto;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { currentGroups: ItemOptionGroupDto[] },
    private dialogRef: MatDialogRef<CopyOptionGroupsDialogComponent>,
    private itemService: ItemsService,
    private optionGroupService: OptionGroupsService
  ) { }

  ngOnInit() {
    this.itemService.getAll().subscribe({
      next: (response) => {
        this.itemsWithGroups = response.filter(i => i.optionGroups?.length)
      }
    });
    this.optionGroupService.getAll(OptionGroupType.DEFAULT)
      .subscribe({
        next: (response) => {
          this.optionGroups = response
        }
      });
  }

  copyAllFromItem(item: ItemDto) {
    this.dialogRef.close(item.optionGroups);
  }

  copySingleGroup() {
    if (!this.selectedGroup) { return; }

    const one: ItemOptionGroupDto = {
      optionGroup: this.selectedGroup,
      index: -1,           
      min: 1,
      max: 1,
      status: Status.AVAILIABLE
    };
  }
}
