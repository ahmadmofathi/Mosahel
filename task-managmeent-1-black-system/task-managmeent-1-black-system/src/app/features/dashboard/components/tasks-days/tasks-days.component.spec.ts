import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDaysComponent } from './tasks-days.component';

describe('TasksDaysComponent', () => {
  let component: TasksDaysComponent;
  let fixture: ComponentFixture<TasksDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksDaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
