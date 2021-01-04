import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubMapComponent } from './pub-map.component';

describe('PubMapComponent', () => {
  let component: PubMapComponent;
  let fixture: ComponentFixture<PubMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PubMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PubMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
