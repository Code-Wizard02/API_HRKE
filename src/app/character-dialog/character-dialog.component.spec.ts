import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterDialogComponent } from './character-dialog.component';

describe('CharacterDialogComponent', () => {
  let component: CharacterDialogComponent;
  let fixture: ComponentFixture<CharacterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
