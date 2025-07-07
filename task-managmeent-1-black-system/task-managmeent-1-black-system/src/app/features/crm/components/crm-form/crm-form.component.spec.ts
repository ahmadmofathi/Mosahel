import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmFormComponent } from './crm-form.component';

describe('CrmFormComponent', () => {
  let component: CrmFormComponent;
  let fixture: ComponentFixture<CrmFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrmFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
