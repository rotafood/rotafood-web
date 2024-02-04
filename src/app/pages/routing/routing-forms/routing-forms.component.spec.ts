import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingFormsComponent } from './routing-forms.component';

describe('RoutingFormsComponent', () => {
  let component: RoutingFormsComponent;
  let fixture: ComponentFixture<RoutingFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutingFormsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoutingFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
