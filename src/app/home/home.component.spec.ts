import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

/**
 * This suite of tests is for the HomeComponent.
 */
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  /**
   * This function runs before each test in the suite.
   * It sets up the testing module and initializes the component and fixture.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * This is a test case that checks if the component is created correctly.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
