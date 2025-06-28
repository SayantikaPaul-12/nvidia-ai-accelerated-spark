import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GradioService {
  private readonly BASE_URL = 'http://127.0.0.1:8000';

  /**
   * Sends a message to the Flask /ask-graph endpoint
   */
  async askGraph(userInput: string, chatHistory: any[] = []): Promise<[string, any[]]> {
    try {
      const response = await fetch(`${this.BASE_URL}/ask-graph`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
   * Clears the conversation via Flask /clear-conversation endpoint
   */
  async clearConversation(): Promise<[string, any[]]> {
    try {
      const response = await fetch(`${this.BASE_URL}/clear-conversation`, {
        method: 'POST',
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
   * Sets the bot agent via Flask /set-bot endpoint
   */
  async setBot(botName: string): Promise<[string, any[]]> {
    try {
      const response = await fetch(`${this.BASE_URL}/set-bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_name: botName }),
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
   * Processes a document via Flask endpoint (optional if you implement it)
   */
  async processDocument(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.BASE_URL}/process-document`, {
        method: 'POST',
        body: formData,
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

  /**
   * Uploads a video file to be processed by Flask /process-video endpoint
   */
  async processVideo(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.BASE_URL}/process-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const json = await response.json();
      if (!json || !json.data) {
        throw new Error('Invalid response format from server');
      }

      return json.data;
    } catch (error) {
      console.error('Error in processVideo:', error);
      throw error;
    }
  }
}
