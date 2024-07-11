import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TransactionsComponent} from './transactions.component';

// Describe function defines a test suite for the TransactionsComponent
describe('TransactionsComponent', () => {
  // Declaring variables for the component instance and its fixture
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;

  // beforeEach function runs before each test in the suite
  beforeEach(async () => {
    // TestBed is the primary API to write unit tests in Angular
    // configureTestingModule method is used to create a dynamic testing module
    await TestBed.configureTestingModule({
      // The component to be tested is imported here
      imports: [TransactionsComponent]
    })
      // compileComponents method is used to compile the component and its template
      .compileComponents();

    // createComponent method is used to create an instance of the component
    fixture = TestBed.createComponent(TransactionsComponent);
    // componentInstance returns the instance of the component class
    component = fixture.componentInstance;
    // detectChanges method is used to perform change detection
    fixture.detectChanges();
  });

  // it functions defines an individual test
  it('should create', () => {
    // expect function is used for assertions
    // toBeTruthy checks if the component instance is defined
    expect(component).toBeTruthy();
  });
});
