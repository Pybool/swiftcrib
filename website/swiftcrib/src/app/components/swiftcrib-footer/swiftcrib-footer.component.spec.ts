import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiftcribFooterComponent } from './swiftcrib-footer.component';

describe('SwiftcribFooterComponent', () => {
  let component: SwiftcribFooterComponent;
  let fixture: ComponentFixture<SwiftcribFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiftcribFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwiftcribFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
