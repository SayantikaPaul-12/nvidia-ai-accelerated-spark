import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GradioService } from '../services/gradio.service';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BaseComponent {
  userInput: string = '';
  isLightMode: boolean = false;

  chatMessages: { text: string; type: 'incoming' | 'outgoing' }[] = [];
  chatHistory: any[] = [];

  displayedText: string = ''; // For animated incoming message
  loading: boolean = false;

  agentTypes = [
    {
      value: 'Socratic Totor Tutor',
      label: 'Socratic Tutor',
      description: 'A tutor specialized in Socratic method.',
    },
    {
      value: 'Quiz Mode',
      label: 'Quiz Mode',
      description: 'Interactive quiz-based learning.',
    },
    {
      value: 'Data Science Mentor',
      label: 'Data Science Mentor',
      description: 'Mentor for detailed data science explanations.',
    },
    {
      value: 'Walkthrough Mode',
      label: 'Walkthrough Mode',
      description: 'Step-by-step walkthroughs and guides.',
    },
  ];

  selectedAgent: string = this.agentTypes[0].value; // Default first agent

  constructor(private gradioService: GradioService) {}

  // New method to change the active chat agent
  async changeChatAgent(botName: string): Promise<void> {
    if (this.selectedAgent === botName) return; // no change
  
    this.loading = true;
    try {
      // Call gradio service to set the bot
      const [initialMessage, updatedChat] = await this.gradioService.setBot(botName);
  
      this.selectedAgent = botName;
  
      // Keep existing chatHistory and chatMessages intact (do NOT overwrite)
  
      if (initialMessage) {
        // Show initial bot message if any — push it to chatMessages and optionally update chatHistory
        this.chatMessages.push({ text: initialMessage, type: 'incoming' });
        
        // Optionally also append to chatHistory if needed (depends on your logic)
        this.chatHistory.push({ role: 'assistant', content: initialMessage });
      }
    } catch (error) {
      console.error('Error changing bot:', error);
    }
    this.loading = false;
  }
  

  // Modified selectAgent to call changeChatAgent
  selectAgent(value: string): void {
    this.changeChatAgent(value);
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput;
    this.chatMessages.push({ text: userMsg, type: 'outgoing' });
    this.loading = true;
    this.displayedText = '';

    try {
      const [_, updatedChat] = await this.gradioService.askGraph(userMsg, this.chatHistory);
      this.chatHistory = updatedChat;

      const lastResponse = updatedChat
        .slice()
        .reverse()
        .find((msg: any) => msg.role === 'assistant');

      if (lastResponse?.content) {
        await this.animateBotResponse(lastResponse.content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.chatMessages.push({ text: 'Error: Could not reach server.', type: 'incoming' });
    }

    this.userInput = '';
    this.loading = false;
  }

  async animateBotResponse(text: string) {
    const words = text.split(' ');
    this.displayedText = '';

    for (let i = 0; i < words.length; i++) {
      this.displayedText += (i > 0 ? ' ' : '') + words[i];
      await this.sleep(80);
    }

    this.chatMessages.push({ text: this.displayedText, type: 'incoming' });
    this.displayedText = '';
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async clearChat() {
    try {
      const [_, clearedChat] = await this.gradioService.clearConversation();
      this.chatHistory = clearedChat;
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
    this.userInput = '';
    this.clearLocalChat();
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.userInput.trim()) return;
    this.sendMessage();
  }

  handleSuggestionClick(text: string): void {
    this.userInput = text;
    this.sendMessage();
  }

  toggleTheme(): void {
    this.isLightMode = !this.isLightMode;
    document.body.classList.toggle('light_mode', this.isLightMode);
    localStorage.setItem('themeColor', this.isLightMode ? 'light_mode' : 'dark_mode');
  }

  clearLocalChat(): void {
    this.chatMessages = [];
    this.displayedText = '';
  }

  copyMessage(text: string): void {
    navigator.clipboard.writeText(text);
    alert('Message copied!');
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('themeColor');
    this.isLightMode = saved === 'light_mode';
    document.body.classList.toggle('light_mode', this.isLightMode);
  }
}
