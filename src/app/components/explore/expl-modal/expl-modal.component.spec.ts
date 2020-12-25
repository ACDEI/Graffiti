import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplModalComponent } from './expl-modal.component';

describe('ExplModalComponent', () => {
  let component: ExplModalComponent;
  let fixture: ComponentFixture<ExplModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
