import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload-handler',
  standalone: true,
  imports: [],
  templateUrl: './file-upload-handler.component.html',
  styleUrls: ['./file-upload-handler.component.scss'],
})
export class FileUploadHandlerComponent {
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
  @Input() note:boolean = false;

  // Extra inputs for image dimensions (optional)
  @Input() maxWidth?: number;
  @Input() maxHeight?: number;

  fileSizeError: boolean = false;

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

  dimensionError: boolean = false;

private handleFile(file: File) {
  // Validate file size first
  if (file.size > this.maxFileSize * 1024 * 1024) {
    this.fileSizeError = true;
    this.dimensionError = false; // Reset dimension error
    return;
  }
  
  // Reset file size error
  this.fileSizeError = false;

  // If the file is an image and dimension restrictions are provided, validate dimensions.
  if (file.type.startsWith('image/') && this.maxWidth && this.maxHeight) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > this.maxWidth! || img.height > this.maxHeight!) {
          // Set dimension error flag if the image dimensions exceed provided limits.
          this.dimensionError = true;
        } else {
          this.dimensionError = false;
          this.fileSelected.emit(file);
        }
      };
      img.onerror = () => {
        this.dimensionError = true;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    // For non-image files or if no dimension limits are provided, emit the file.
    this.dimensionError = false;
    this.fileSelected.emit(file);
  }
}

}
