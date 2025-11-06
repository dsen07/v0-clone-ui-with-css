import { Component, Input, Output, EventEmitter } from "@angular/core"
import type { LogEntry } from "../../models/log.model"

@Component({
  selector: "app-log-modal",
  templateUrl: "./log-modal.component.html",
  styleUrls: ["./log-modal.component.css"],
})
export class LogModalComponent {
  @Input() log!: LogEntry
  @Input() isChild = false
  @Output() close = new EventEmitter<void>()
  @Output() openJson = new EventEmitter<{ data: any; title: string }>()

  activeTab: "overview" | "request" | "response" = "overview"

  onClose(): void {
    this.close.emit()
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose()
    }
  }

  setActiveTab(tab: "overview" | "request" | "response"): void {
    this.activeTab = tab
  }

  viewRequestJson(): void {
    this.openJson.emit({ data: this.log.request, title: "Request Body" })
  }

  viewResponseJson(): void {
    this.openJson.emit({ data: this.log.response, title: "Response Body" })
  }

  getMethodClass(method: string): string {
    const methodMap: Record<string, string> = {
      GET: "method-get",
      POST: "method-post",
      PUT: "method-put",
      DELETE: "method-delete",
      PATCH: "method-patch",
    }
    return methodMap[method] || ""
  }

  getStatusClass(status: number): string {
    if (status >= 200 && status < 300) return "status-success"
    if (status >= 300 && status < 400) return "status-redirect"
    if (status >= 400 && status < 500) return "status-client-error"
    if (status >= 500) return "status-server-error"
    return ""
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : []
  }
}
