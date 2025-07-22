import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadHandlerComponent } from './file-upload-handler.component';

describe('FileUploadHandlerComponent', () => {
  let component: FileUploadHandlerComponent;
  let fixture: ComponentFixture<FileUploadHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadHandlerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileUploadHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
