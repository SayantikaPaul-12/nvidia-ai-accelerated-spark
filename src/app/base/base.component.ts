import { Component, ViewEncapsulation, ViewChild, ElementRef, AfterViewChecked, HostListener, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GradioService } from '../services/gradio.service';
import { MarkdownModule } from 'ngx-markdown';
import { HeaderComponent } from '../header/header.component';
import { AgentSelectorComponent } from '../agent-selector/agent-selector.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { UploadedFilesComponent } from '../uploaded-files/uploaded-files.component';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkdownModule,
    HeaderComponent,
    AgentSelectorComponent,
    ChatWindowComponent,
    UploadedFilesComponent,
  ],
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
      value: '🎥 Video Tutorial Bot',
      label: 'Video Tutorial Bot',
      description: 'Upload a video and it will learn from it, then answer questions about the video content.',
      icon: 'smart_display', // Play icon for tutorials
    },
    {
      value: 'Socratic Tutor',
      label: 'Socratic Tutor',
      description: 'Gently asks questions and nudges you to find answers yourself.',
      icon: 'psychology_alt', // Brain icon
    },
    {
      value: 'General Purpose Assistant',
      label: 'General Purpose Assistant',
      description: 'Similar to your favourite AI assistant, but with a focus on learning Data Science.',
      icon: 'neurology', // Headset assistant
    },
    {
      value: 'GPU Benchmarking & Guidance',
      label: 'GPU Benchmarking & Guidance',
      description: 'Writes code well, speeds it up with GPUs, and runs the code to tell exactly how long it runs.',
      icon: 'memory', // Chip/memory icon
    },
    {
      value: '📝 Quiz Mode',
      label: 'Quiz Mode',
      description: 'Interactive quiz-based learning to test your knowledge on Data Science.',
      icon: 'quiz', // Question mark bubble
    },
  ];
  

  selectedAgent: string = this.agentTypes[0].value; // Default first agent

  constructor(private gradioService: GradioService) { }

  ngOnInit(): void {
    const saved = localStorage.getItem('themeColor');
    this.isLightMode = saved === 'light_mode';
    document.body.classList.toggle('light_mode', this.isLightMode);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const header = document.querySelector('.header');
    const floatingBox = document.querySelector('.agent-selector-box') as HTMLElement;

    if (header && floatingBox) {
      const rect = header.getBoundingClientRect();
      floatingBox.style.display = rect.bottom < 0 ? 'block' : 'none';
    }
  }

  async changeChatAgent(botName: string): Promise<void> {
    if (this.selectedAgent === botName) return; // no change
    if (this.loading) return;

    this.loading = true;
    try {
      // 1. Set the bot first
      const [initialMessage, updatedChat] = await this.gradioService.setBot(botName);
      this.selectedAgent = botName;

      this.chatHistory = [];

      // 2. Keep chat history but send a special prompt message that contains conversation summary
      // Compose a user message summarizing chat history
      const historySummary = this.chatHistory
        .map(msg => `${msg.role}: ${typeof msg.content === 'string' ? msg.content : '[non-text content]'}`)
        .join('\n');

      if (!historySummary) {
        this.loading = false;
        return;
      }

      // const systemPrompt = `Keep this for reference as the previous history:\n${historySummary}.`;
      // console.log(systemPrompt)
      // await this.sendMessage(systemPrompt);

      // // 4. Optionally, add the initial bot message from setBot call
      // // if (initialMessage) {
      // //   this.chatMessages.push({ text: initialMessage, type: 'incoming' });
      // //   this.chatHistory.push({ role: 'assistant', content: initialMessage });
      // // }

      // this.chatMessages.splice(-2, 2);
      // this.chatHistory.splice(-2, 2);

    } catch (error) {
      console.error('Error changing bot:', error);
    }
    this.loading = false;
  }

  selectAgent(value: string): void {
    this.changeChatAgent(value);
  }

  async sendMessage(messageOverride?: string) {
    const userMsg = messageOverride !== undefined ? messageOverride : this.userInput.trim();
    if (!userMsg) return;
    if (this.loading && !messageOverride) return;

    // Push outgoing message
    this.chatMessages.push({ text: userMsg, type: 'outgoing' });

    this.loading = true;
    this.displayedText = '';

    // Clear userInput only if not overridden message
    if (messageOverride === undefined) {
      this.userInput = '';
    }

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

  uploadedFiles: File[] = [];

  async handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
  
      for (const file of filesArray) {
        if (this.uploadedFiles.some(f => f.name === file.name)) continue;
  
        this.uploadedFiles.push(file);
        this.loading = true;
  
        try {
          // Call new GradioService method for video processing
          const result = await this.gradioService.processVideo(file);
  
          this.chatMessages.push({
            text: `Video: ${file.name} processed. Response: ${result}`,
            type: 'incoming',
          });
        } catch (error) {
          console.error('File upload failed:', error);
          this.chatMessages.push({
            text: `Error processing video ${file.name}`,
            type: 'incoming',
          });
        } finally {
          this.loading = false;
        }
      }
    }
  }
  
}
