import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiftcribButtonComponent } from './swiftcrib-button.component';

describe('SwiftcribButtonComponent', () => {
  let component: SwiftcribButtonComponent;
  let fixture: ComponentFixture<SwiftcribButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiftcribButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwiftcribButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
