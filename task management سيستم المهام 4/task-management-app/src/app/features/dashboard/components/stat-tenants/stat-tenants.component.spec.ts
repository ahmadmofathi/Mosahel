import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatTenantsComponent } from './stat-tenants.component';

describe('StatTenantsComponent', () => {
  let component: StatTenantsComponent;
  let fixture: ComponentFixture<StatTenantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatTenantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatTenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
