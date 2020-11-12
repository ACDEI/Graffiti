import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeGestionComponent } from './theme-gestion.component';

describe('ThemeGestionComponent', () => {
  let component: ThemeGestionComponent;
  let fixture: ComponentFixture<ThemeGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeGestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
