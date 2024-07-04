import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';

/**
 * Test Suite for AppComponent
 *
 * This suite contains unit tests for the AppComponent.
 * The component is provided and instantiated before each test.
 * The suite contains three tests:
 * 1. Verifying that the AppComponent is created successfully.
 * 2. Verifying that the AppComponent has the correct title.
 * 3. Verifying that the AppComponent renders the title correctly in the template.
 */

describe('AppComponent', () => {
  /**
   * Before each test, the TestBed is configured with the AppComponent as an import.
   * The TestBed then compiles the components.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  /**
   * Test Case: Component Creation
   *
   * This test verifies that the AppComponent is created successfully.
   * The 'toBeTruthy' assertion is used to check that the 'app' variable is defined and not null.
   */

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Ag-Grid-Testing' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Ag-Grid-Testing');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, Ag-Grid-Testing');
  });
});
