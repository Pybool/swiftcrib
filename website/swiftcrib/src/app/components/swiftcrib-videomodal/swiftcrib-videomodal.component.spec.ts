import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiftcribVideomodalComponent } from './swiftcrib-videomodal.component';

describe('SwiftcribVideomodalComponent', () => {
  let component: SwiftcribVideomodalComponent;
  let fixture: ComponentFixture<SwiftcribVideomodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiftcribVideomodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwiftcribVideomodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
