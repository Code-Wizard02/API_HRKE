import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MarvelService } from '../services/marvel.service';

@Component({
  selector: 'app-marvel-table',
  standalone: true,
  imports: [MatTableModule, MatPaginator, MatSort, MatSortModule],
  templateUrl: './marvel-table.component.html',
  styleUrl: './marvel-table.component.css',
})
export class MarvelTableComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'thumbnail'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private marvelService: MarvelService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(limit: number = 100, offset: number = 0) {
    this.marvelService.getCharacters(limit, offset).subscribe(
      (response) => {
        this.dataSource.data = response.data.results;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
