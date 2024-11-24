import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    CommonModule,
  ],
  templateUrl: './character-info.component.html',
  styleUrl: './character-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterInfoComponent {
  backgroundImageURL: string;
  constructor(
    public dialogRef: MatDialogRef<CharacterInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public character: any
  ) {
    this.backgroundImageURL = `url(${character.thumbnail.path}.${character.thumbnail.extension})`;
    console.log(character);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
