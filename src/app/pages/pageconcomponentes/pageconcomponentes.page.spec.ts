import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageconcomponentesPage } from './pageconcomponentes.page';

describe('PageconcomponentesPage', () => {
  let component: PageconcomponentesPage;
  let fixture: ComponentFixture<PageconcomponentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageconcomponentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
