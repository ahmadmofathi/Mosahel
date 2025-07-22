import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-file-upload-resume',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './file-upload-resume.component.html',
  styleUrl: './file-upload-resume.component.scss',
})
export class FileUploadResumeComponent {
  @Input('size') maxFileSize: number = 6;
  @Input() imagePreview: string | ArrayBuffer | null = null;
  @Input() isRequired: boolean = false;
  @Input() isVideo?: boolean = false;
  @Input() ispdf?: boolean = false;
  @Input() isFile?: boolean = false;
  @Input() fileName?: string = '';
  @Input() idInput?: string = 'file-id';
  @Output() fileSelected = new EventEmitter<File>();
  @Output() cancelClicked = new EventEmitter<void>();

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  fileSizeError: boolean = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onCancelClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cancelClicked.emit();
  }

  private handleFile(file: File) {
    if (file.size > this.maxFileSize * 1024 * 1024) {
      this.fileSizeError = true;
      return;
    }
    this.fileSizeError = false;
    this.fileSelected.emit(file);
  }
}
