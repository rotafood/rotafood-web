import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../../../../core/services/commands.service';
import { FullCommandDto } from '../../../../core/interfaces/full-command-dto';
import { CanDeleteDialogComponent } from '../../../../shared/can-delete-dialog/can-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommandCreateOrUpdateDialogComponent } from '../../components/command-create-or-update-dialog/command-create-or-update-dialog.component';


@Component({
  selector: 'app-commands-list-page',
  templateUrl: './commands-list-page.component.html',
  styleUrl: './commands-list-page.component.scss'
})
export class CommandsListPageComponent implements OnInit {
  commands: FullCommandDto[] = [];
  isLoading = false;

  constructor(
    private readonly commandsService: CommandsService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCommands();
  }

  getCommands(): void {
    this.isLoading = true;
    this.commandsService.getAllCommands().subscribe({
      next: (commands) => {
        this.commands = commands.sort((a, b) => a.merchantSequence - b.merchantSequence);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  addCommand(): void {
    const dialogRef = this.dialog.open(CommandCreateOrUpdateDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCommands();
      }
    });
  }

  editCommand(command: FullCommandDto): void {
    const dialogRef = this.dialog.open(CommandCreateOrUpdateDialogComponent, {
      width: '500px',
      data: { command }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCommands();
      }
    });
  }

  deleteCommand(command: FullCommandDto): void {
    const dialogRef = this.dialog.open(CanDeleteDialogComponent, {
      data: {
        title: 'Excluir comanda',
        message: `Tem certeza que deseja excluir a comanda #${command.merchantSequence}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.commandsService.deleteCommand(command.id!).subscribe({
          next: () => this.getCommands()
        });
      }
    });
  }
}