import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiftcribHeaderComponent } from './swiftcrib-header.component';

describe('SwiftcribHeaderComponent', () => {
  let component: SwiftcribHeaderComponent;
  let fixture: ComponentFixture<SwiftcribHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiftcribHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SwiftcribHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
