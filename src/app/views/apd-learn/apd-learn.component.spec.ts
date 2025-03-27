import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApdLearnComponent } from './apd-learn.component';

describe('ApdLearnComponent', () => {
  let component: ApdLearnComponent;
  let fixture: ComponentFixture<ApdLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApdLearnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApdLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
