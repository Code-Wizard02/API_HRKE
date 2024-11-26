import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort,MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MarvelService } from '../services/marvel.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CharacterInfoComponent } from '../character-info/character-info.component';
import { CharacterDeleteComponent } from '../character-delete/character-delete.component';
import { CharacterEditComponent } from '../character-edit/character-edit.component';
import { FormsModule } from '@angular/forms';
import { MatSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marvel-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginator,
    MatSort,
    MatIcon,
    FormsModule,
    MatSpinner,
    CommonModule,
    MatSortModule
  ],
  templateUrl: './marvel-table.component.html',
  styleUrl: './marvel-table.component.css',
})
export class MarvelTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'thumbnail', 'actions'];
  dataSource = new MatTableDataSource<any>();
  filterValue: string = '';
  isLoading: boolean = false;
  // isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private marvelService: MarvelService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCharacters();
    console.log(this.sort);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // console.log('MatSort initialized:', this.sort);
  }


  loadCharacters(limit: number = 50, offset: number = 0) {
    this.isLoading = false;
    this.marvelService.getCharacters(limit, offset).subscribe(
      (response) => {
        this.dataSource.data = response.data.results;
        // this.dataSource.paginator = this.paginator;
        // this.isLoading = false;
        this.dataSource.sort = this.sort;
        console.log(this.sort);
      },
      (error) => {
        console.error('Error fetching Marvel characters:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  openInfo(character: any): void {
    this.dialog.open(CharacterInfoComponent, {
      data: character,
      width: '500px',
      height: 'auto',
    });
  }

  openDeleteCharacter(character: any): void {
    const dialogRef = this.dialog.open(CharacterDeleteComponent, {
      data: { name: character.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.dataSource.data.findIndex(
          (c: any) => c.id === character.id
        );
        if (index > -1) {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription(); // Notify the table about the data change
        }
      }
    });
  }

  openEditCharacter(character: any) {
    const dialogRef = this.dialog.open(CharacterEditComponent, {
      width: '250px',
      data: { ...character },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Object.assign(character, result);
        const index = this.dataSource.data.findIndex(
          (c: any) => c.id === character.id
        );
        if (index > -1) {
          this.dataSource.data[index] = character;
          this.dataSource._updateChangeSubscription(); // Notify the table about the data change
        }
      }
    });
  }
}
