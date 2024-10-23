import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalOpcionesPage } from './modal-opciones.page';

describe('ModalOpcionesPage', () => {
  let component: ModalOpcionesPage;
  let fixture: ComponentFixture<ModalOpcionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOpcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
