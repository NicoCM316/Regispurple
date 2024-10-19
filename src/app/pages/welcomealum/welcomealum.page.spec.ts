import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomealumPage } from './welcomealum.page';

describe('WelcomealumPage', () => {
  let component: WelcomealumPage;
  let fixture: ComponentFixture<WelcomealumPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomealumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
