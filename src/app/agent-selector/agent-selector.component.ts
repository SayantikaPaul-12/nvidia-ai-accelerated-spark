import { Component, Input, Output, EventEmitter, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-selector.component.html',
  styleUrls: ['./agent-selector.component.css'],
})
export class AgentSelectorComponent implements AfterViewInit {
  @Input() agentTypes: { value: string; label: string; description: string; icon: string }[] = [];
  @Input() selectedAgent: string = '';
  @Output() agentSelected = new EventEmitter<string>();

  onAgentClick(agentValue: string) {
    this.agentSelected.emit(agentValue);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const header = document.querySelector('.header');
    const floatingBox = this.elementRef.nativeElement.querySelector('.agent-selector-box');

    if (header && floatingBox) {
      const rect = header.getBoundingClientRect();
      floatingBox.classList.toggle('hidden', rect.bottom >= 0);
    }
  }

  constructor(private elementRef: ElementRef) {}
  ngAfterViewInit() {
    this.onScroll(); // check on load
  }

}
