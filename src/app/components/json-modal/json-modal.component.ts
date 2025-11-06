import { Component, Input, Output, EventEmitter } from "@angular/core"

@Component({
  selector: "app-json-modal",
  templateUrl: "./json-modal.component.html",
  styleUrls: ["./json-modal.component.css"],
})
export class JsonModalComponent {
  @Input() data: any
  @Input() title = "JSON Data"
  @Output() close = new EventEmitter<void>()

  onClose(): void {
    this.close.emit()
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose()
    }
  }

  copyToClipboard(): void {
    const jsonString = JSON.stringify(this.data, null, 2)
    navigator.clipboard.writeText(jsonString).then(() => {
      alert("JSON copied to clipboard!")
    })
  }
}
