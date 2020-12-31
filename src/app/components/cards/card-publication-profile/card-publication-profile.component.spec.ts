import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPublicationProfileComponent } from './card-publication-profile.component';

describe('CardPublicationProfileComponent', () => {
  let component: CardPublicationProfileComponent;
  let fixture: ComponentFixture<CardPublicationProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardPublicationProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPublicationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
