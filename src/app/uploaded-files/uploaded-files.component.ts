import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uploaded-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uploaded-files.component.html',
  styleUrls: ['./uploaded-files.component.css'],
})
export class UploadedFilesComponent {
  @Input() uploadedFiles: File[] = [];
}
