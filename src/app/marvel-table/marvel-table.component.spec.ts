import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarvelTableComponent } from './marvel-table.component';

describe('MarvelTableComponent', () => {
  let component: MarvelTableComponent;
  let fixture: ComponentFixture<MarvelTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarvelTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarvelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
