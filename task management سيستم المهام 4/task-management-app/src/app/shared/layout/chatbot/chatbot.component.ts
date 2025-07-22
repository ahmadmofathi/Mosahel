import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
})
export class ChatbotComponent {
  isRobot: boolean = true;
  toggleRobot() {
    this.isRobot = !this.isRobot;
  }
}
