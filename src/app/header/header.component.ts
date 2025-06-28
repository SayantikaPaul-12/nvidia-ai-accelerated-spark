import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() agentTypes: { value: string; label: string; description: string }[] = [];
  @Input() selectedAgent: string = '';
  @Output() agentSelected = new EventEmitter<string>();

  onAgentClick(agentValue: string) {
    this.agentSelected.emit(agentValue);
  }
}
