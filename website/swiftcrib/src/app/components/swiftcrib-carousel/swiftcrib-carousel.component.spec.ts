import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiftcribCarouselComponent } from './swiftcrib-carousel.component';

describe('SwiftcribCarouselComponent', () => {
  let component: SwiftcribCarouselComponent;
  let fixture: ComponentFixture<SwiftcribCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiftcribCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwiftcribCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
