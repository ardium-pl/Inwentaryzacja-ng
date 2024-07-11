import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalizaZwolnienComponent } from './analiza-zwolnien.component';

describe('AnalizaZwolnienComponent', () => {
  let component: AnalizaZwolnienComponent;
  let fixture: ComponentFixture<AnalizaZwolnienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalizaZwolnienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalizaZwolnienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
