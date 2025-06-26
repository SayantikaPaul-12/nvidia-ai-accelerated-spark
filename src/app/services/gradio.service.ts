import { Injectable } from '@angular/core';
import { Client } from '@gradio/client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GradioService {
  private client: any;

  async initClient() {
    console.log('environment.GRADIO_API_URL:',environment.GRADIO_API_URL);
    this.client = await Client.connect(environment.GRADIO_API_URL);
  }

  async askGraph(userInput: string, chatHistory: any[] = []) {
    if (!this.client) {
      await this.initClient();
    }

    const result = await this.client.predict("/ask_graph", {
      user_input: userInput,
      chat_history: chatHistory
    });

    return result.data; // returns [textboxOutput, updatedChatHistory]
  }

  async clearConversation() {
    if (!this.client) {
      await this.initClient();
    }

    const result = await this.client.predict("/clear_conversation", {});
    return result.data;
  }
}
