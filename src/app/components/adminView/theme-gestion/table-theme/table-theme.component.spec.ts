import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableThemeComponent } from './table-theme.component';

describe('TableThemeComponent', () => {
  let component: TableThemeComponent;
  let fixture: ComponentFixture<TableThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableThemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
