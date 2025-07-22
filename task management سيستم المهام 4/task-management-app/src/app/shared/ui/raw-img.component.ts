import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "raw-img",
  standalone: true,
  imports: [CommonModule],
  template: `
    <img [src]="image" [alt]="altText || ''" [class]="class || ''" />
  `,
})
export class RawImg {
  @Input() image: string = "";
  @Input() altText: string = "";
  @Input() class: string = "";
}
