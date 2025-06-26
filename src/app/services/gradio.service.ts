import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GradioService {
  private readonly API_URL = '/.netlify/functions/gradio-proxy';

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

      // The proxy returns JSON like { data: [...] }
      // We want the array inside `data` property
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
}
