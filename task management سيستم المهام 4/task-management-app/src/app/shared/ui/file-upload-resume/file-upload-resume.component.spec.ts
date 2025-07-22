import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadResumeComponent } from './file-upload-resume.component';

describe('FileUploadResumeComponent', () => {
  let component: FileUploadResumeComponent;
  let fixture: ComponentFixture<FileUploadResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadResumeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileUploadResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
