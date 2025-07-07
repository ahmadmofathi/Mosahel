import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'masar';
  isOpen = false;

  questions = [
    { q: 'What is Angular?', a: 'Angular is a platform for building web applications.' },
    { q: 'What is a component?', a: 'A component controls a patch of screen called a view.' },
    { q: 'How does routing work in Angular?', a: 'Angular uses a RouterModule to define routes and navigate.' }
  ];

  messages: { text: string, from: 'user' | 'bot' }[] = [];

  toggle(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  askQuestion(question: any) {
    this.messages.push({ text: question.q, from: 'user' });
    setTimeout(() => {
      this.messages.push({ text: question.a, from: 'bot' });
    }, 500);
  }
}
