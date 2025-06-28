import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GradioService {
  private readonly API_URL = environment.GRADIO_API_URL;

  /**
   * Sends a message to the Gradio proxy serverless function
   * @param userInput User's text input
   * @param chatHistory Current chat history array
   * @returns Promise resolving to [textboxOutput: string, updatedChatHistory: any[]]
   */
  async askGraph(userInput: string, chatHistory: any[] = []): Promise<[string, any[]]> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ask_graph',
          user_input: userInput,
          chat_history: chatHistory,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const json = await response.json();

      if (!json || !Array.isArray(json.data)) {
        throw new Error('Invalid response format from server');
      }

      return json.data as [string, any[]];
    } catch (error) {
      console.error('Error in askGraph:', error);
      return ['Error: Server failed to respond.', []];
    }
  }

  /**
   * Clears the conversation via Gradio proxy
   * @returns Promise resolving to [textboxOutput: string, updatedChatHistory: any[]]
   */
  async clearConversation(): Promise<[string, any[]]> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clear_conversation',
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const json = await response.json();

      if (!json || !Array.isArray(json.data)) {
        throw new Error('Invalid response format from server');
      }

      return json.data as [string, any[]];
    } catch (error) {
      console.error('Error in clearConversation:', error);
      return ['Error clearing conversation.', []];
    }
  }

  /**
   * Sets the bot agent via Gradio proxy
   * @param botName Name of the bot agent selected
   * @returns Promise resolving to [textboxOutput: string, updatedChatHistory: any[]]
   */
  async setBot(botName: string): Promise<[string, any[]]> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_bot',
          bot_name: botName,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const json = await response.json();

      if (!json || !Array.isArray(json.data)) {
        throw new Error('Invalid response format from server');
      }

      return json.data as [string, any[]];
    } catch (error) {
      console.error('Error in setBot:', error);
      return ['Error: Failed to set bot.', []];
    }
  }

    /**
   * Processes a document via Gradio proxy (uploads and gets response)
   * @param file File to be uploaded and processed
   * @returns Promise resolving to the result from Gradio backend
   */
  async processDocument(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('action', 'process_document'); // Custom action for your proxy logic

      const response = await fetch(this.API_URL, {
        method: 'POST',
        body: formData, // Note: No Content-Type header here — browser sets it automatically
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const json = await response.json();

      if (!json || !json.data) {
        throw new Error('Invalid response format from server');
      }

      return json.data;
    } catch (error) {
      console.error('Error in processDocument:', error);
      throw error;
    }
  }


}
