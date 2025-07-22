import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksClassificationComponent } from './tasks-classification.component';

describe('TasksClassificationComponent', () => {
  let component: TasksClassificationComponent;
  let fixture: ComponentFixture<TasksClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksClassificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
