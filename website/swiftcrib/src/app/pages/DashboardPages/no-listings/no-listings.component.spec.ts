import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoListingsComponent } from './no-listings.component';

describe('NoListingsComponent', () => {
  let component: NoListingsComponent;
  let fixture: ComponentFixture<NoListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoListingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
