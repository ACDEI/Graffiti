import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardUserNormalComponent } from './card-user-normal.component';

describe('CardUserNormalComponent', () => {
  let component: CardUserNormalComponent;
  let fixture: ComponentFixture<CardUserNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardUserNormalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardUserNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
