import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-selector.component.html',
  styleUrls: ['./agent-selector.component.css'],
})
export class AgentSelectorComponent {
  @Input() agentTypes: { value: string; label: string; description: string }[] = [];
  @Input() selectedAgent: string = '';
  @Output() agentSelected = new EventEmitter<string>();

  onAgentClick(agentValue: string) {
    this.agentSelected.emit(agentValue);
  }
}
