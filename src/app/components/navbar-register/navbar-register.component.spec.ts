import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarRegisterComponent } from './navbar-register.component';

describe('NavbarRegisterComponent', () => {
  let component: NavbarRegisterComponent;
  let fixture: ComponentFixture<NavbarRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
