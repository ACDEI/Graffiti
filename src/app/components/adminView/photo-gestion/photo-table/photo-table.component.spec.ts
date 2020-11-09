import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoTableComponent } from './photo-table.component';

describe('PhotoTableComponent', () => {
  let component: PhotoTableComponent;
  let fixture: ComponentFixture<PhotoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
