import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-delete',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './character-delete.component.html',
  styleUrl: './character-delete.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<CharacterDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public character: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
