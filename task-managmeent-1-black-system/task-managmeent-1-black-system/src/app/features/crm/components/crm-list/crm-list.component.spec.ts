import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmListComponent } from './crm-list.component';

describe('CrmListComponent', () => {
  let component: CrmListComponent;
  let fixture: ComponentFixture<CrmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrmListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
