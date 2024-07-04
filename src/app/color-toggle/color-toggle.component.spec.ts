import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorToggleComponent } from './color-toggle.component';

describe('ColorToggleComponent', () => {
  let component: ColorToggleComponent;
  let fixture: ComponentFixture<ColorToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorToggleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have at least 15 colors', () => {
    expect(component.colorNames.length).toBeGreaterThanOrEqual(15);
  });

  it('should select a color when clicked', () => {
    const firstColor = component.colorNames[0];
    component.selectColor(firstColor);
    expect(component.transactionDataStorageService.currentSelection).toBe(firstColor);
  });
});
