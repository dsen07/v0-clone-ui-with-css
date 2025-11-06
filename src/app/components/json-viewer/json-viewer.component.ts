import { Component, Input } from "@angular/core"

@Component({
  selector: "app-json-viewer",
  templateUrl: "./json-viewer.component.html",
  styleUrls: ["./json-viewer.component.css"],
})
export class JsonViewerComponent {
  @Input() data: any

  get jsonString(): string {
    return JSON.stringify(this.data, null, 2)
  }
}
