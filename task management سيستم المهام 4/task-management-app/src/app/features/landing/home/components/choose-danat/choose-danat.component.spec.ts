import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDanatComponent } from './choose-danat.component';

describe('ChooseDanatComponent', () => {
  let component: ChooseDanatComponent;
  let fixture: ComponentFixture<ChooseDanatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDanatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseDanatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
