import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FullCommandDto } from '../../../../core/interfaces/full-command-dto';
import { CommandsService } from '../../../../core/services/commands.service';

@Component({
  selector: 'app-command-create-or-update-dialog',
  templateUrl: './command-create-or-update-dialog.component.html',
  styleUrl: './command-create-or-update-dialog.component.scss',
})
export class CommandCreateOrUpdateDialogComponent {
  commandForm = new FormGroup({
    id: new FormControl<string | null>(this.data?.command?.id ?? null),
    name: new FormControl(this.data?.command?.name ?? '', [Validators.required]),
    tableIndex: new FormControl(this.data?.command?.tableIndex ?? null),
    total: new FormControl(this.data?.command?.total ?? 0),
    paid: new FormControl(this.data?.command?.paid ?? false),
  });

  constructor(
    public dialogRef: MatDialogRef<CommandCreateOrUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { command?: FullCommandDto },
    private readonly commandsService: CommandsService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.commandForm.valid) {
      const command = this.commandForm.value;
      this.commandsService.createOrUpdateCommand(command as FullCommandDto).subscribe({
        next: (res) => {
          this.snackbar.open('Comanda salva com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(res);
        },
        error: (err) => {
          this.snackbar.open(err.error || 'Erro ao salvar comanda.', 'Fechar', { duration: 3000 });
        },
      });
    }
  }

  payCommand() {
    this.snackbar.open('Função de pagamento da comanda ainda não implementada.', 'Fechar', { duration: 3000 });
  }
}
