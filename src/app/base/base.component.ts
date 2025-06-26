import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GradioService } from '../services/gradio.service';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  predefinedResponses: { [key: string]: string } = {
    "hi": "Hello! How may I assist you?",
    "hello": "Hi there! Ready to talk Data Science?",
    "what is your name?": "I'm 80++, your friendly AI assistant!",
    "what is data science": "Data science is an interdisciplinary field that uses statistical and computational techniques to extract insights from data. It involves data cleaning, modeling, visualization, and deployment.",
    "what programming languages are used in data science": "Popular languages include Python, R, and Julia. Python is most widely used due to libraries like pandas, scikit-learn, TensorFlow, and PyTorch.",
    "what is machine learning": "Machine learning is a subset of AI that enables systems to learn patterns from data and make predictions or decisions without being explicitly programmed.",
    "why use gpu for data science": "GPUs (Graphics Processing Units) accelerate computations—especially for deep learning and large-scale data processing—by parallelizing operations across thousands of cores.",
    "what is nvidia cuda": "CUDA is NVIDIA's parallel computing platform and API. It allows developers to use NVIDIA GPUs for general-purpose processing like deep learning and scientific computation.",
    "what is nvidia": "NVIDIA is a leading manufacturer of GPUs. Their hardware powers many machine learning and AI systems due to superior performance and support for deep learning frameworks.",
    "which nvidia gpus are good for data science": "The RTX 40-series, RTX 30-series (like 3090), and A100 GPUs are excellent for deep learning and data science. They offer high CUDA core counts and VRAM for large models.",
    "what is tensorflow": "TensorFlow is an open-source deep learning framework developed by Google. It supports neural network design, training, and deployment—often accelerated by GPUs.",
    "what is pytorch": "PyTorch is a popular deep learning framework developed by Meta (Facebook). It’s known for its dynamic computation graph and GPU acceleration via CUDA.",
    "how to use gpu with pytorch": `
import torch
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MyModel().to(device)
`,
    "can you help me with data science": "Absolutely! Ask me anything about machine learning, data analysis, or using GPUs for AI.",
  };

  constructor(private gradioService: GradioService) {}

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
