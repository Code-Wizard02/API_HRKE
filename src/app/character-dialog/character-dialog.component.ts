import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-character-dialog',
  standalone: true,
  imports: [],
  templateUrl: './character-dialog.component.html',
  styleUrl: './character-dialog.component.css',
})
export class CharacterDialogComponent {
  readonly dialogRef = Inject(MatDialogRef<CharacterDialogComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  onClosed(): void {
    console.log('Dialog was closed');
    this.dialogRef.close();
  }
}
