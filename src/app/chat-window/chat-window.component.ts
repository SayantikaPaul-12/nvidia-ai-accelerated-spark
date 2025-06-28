import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
})
export class ChatWindowComponent {
  @Input() chatMessages: { text: string; type: 'incoming' | 'outgoing' }[] = [];
  @Input() loading: boolean = false;
  @Input() displayedText: string = '';

  @Output() copy = new EventEmitter<string>();

  onCopyClick(text: string) {
    this.copy.emit(text);
  }
}
