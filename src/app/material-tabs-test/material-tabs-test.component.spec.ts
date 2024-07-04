import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MaterialTabsTestComponent} from './material-tabs-test.component';

// Describe the test suite
describe('MaterialTabsTestComponent', () => {
  // Define the component and fixture
  let component: MaterialTabsTestComponent;
  let fixture: ComponentFixture<MaterialTabsTestComponent>;

  // Before each test, configure the testing module
  beforeEach(async () => {
    // Configure the testing module
    await TestBed.configureTestingModule({
      imports: [MaterialTabsTestComponent]
    })
      .compileComponents();

    // Create the component
    fixture = TestBed.createComponent(MaterialTabsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test the component
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
