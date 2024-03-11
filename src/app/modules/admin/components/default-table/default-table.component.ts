import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ColumnConfig } from '../../../../core/interfaces/column-config';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-default-table',
  templateUrl: './default-table.component.html',
  styleUrl: './default-table.component.scss'
})
export class DefaultTableComponent implements OnInit, OnChanges {

  @Input() data!: any[];
  @Input() columnsConfig!: ColumnConfig<string>[];
  @Input() path!: string;
  @Input() formGroup!: FormGroup;
  @Output() searchEvent = new EventEmitter<string | undefined>();
  @Output() deleteEvent = new EventEmitter<number>();

  public displayedColumns!: string[];

  public noContent = false;

  ngOnInit() {
    this.displayedColumns = this.columnsConfig.map((item) => item.key);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columnsConfig']) {
      this.columnsConfig = changes['columnsConfig'].currentValue as ColumnConfig<string>[]
      this.displayedColumns = this.columnsConfig.map(column => column.key);
      console.log(this.displayedColumns)
      console.log(changes['columnsConfig'].currentValue)
    }
  }

  getFormControl(key: string): FormControl | null {
    const control = this.formGroup.get(key);
    return control instanceof FormControl ? control : null;
  }

  onSearch(key?: string): void {
    this.searchEvent.emit(key);
  }

  onDelete(id?: number): void {
    this.deleteEvent.emit(id);
  }

  toggleColumnVisibility(columnKey: string): void {
    const column = this.columnsConfig.find(c => c.key === columnKey);
    if (column) {
      column.visible = !column.visible;
    }
    this.displayedColumns = this.columnsConfig.filter(c => c.visible).map(c => c.key);

    console.log("True", this.displayedColumns)
  }
  

}
