import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGestionComponent } from './photo-gestion.component';

describe('PhotoGestionComponent', () => {
  let component: PhotoGestionComponent;
  let fixture: ComponentFixture<PhotoGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoGestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
