import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-character-edit',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, CommonModule, FormsModule],
  templateUrl: './character-edit.component.html',
  styleUrl: './character-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterEditComponent {
  backgroundImageURL: string;
  constructor(
    public dialogRef: MatDialogRef<CharacterEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.backgroundImageURL = `url(${data.thumbnail.path}.${data.thumbnail.extension})`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.data);
  }
}
