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

  // UI state
  activeTab: "overview" | "request" | "response" = "overview"

  // store expanded node ids (Set for O(1) checks)
  expanded = new Set<string | number>()

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

  viewRequestJson(entry: LogEntry): void {
    this.openJson.emit({ data: entry.request, title: `${entry.endpoint} - Request Body` })
  }

  viewResponseJson(entry: LogEntry): void {
    this.openJson.emit({ data: entry.response, title: `${entry.endpoint} - Response Body` })
  }

  getMethodClass(method: string): string {
    const methodMap: Record<string, string> = {
      GET: "method-get",
      POST: "method-post",
      PUT: "method-put",
      DELETE: "method-delete",
      PATCH: "method-patch",
    }
    return methodMap[method] || "method-get"
  }

  getStatusClass(status: number): string {
    if (status >= 200 && status < 300) return "status-success"
    if (status >= 300 && status < 400) return "status-redirect"
    if (status >= 400 && status < 500) return "status-client-error"
    if (status >= 500) return "status-server-error"
    return "status-info"
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : []
  }

  // expansion helpers
  isExpanded(id: string | number | undefined): boolean {
    if (id === undefined || id === null) return false
    return this.expanded.has(id)
  }

  toggleExpanded(id: string | number | undefined, event?: MouseEvent): void {
    if (event) event.stopPropagation()
    if (id === undefined || id === null) return
    if (this.expanded.has(id)) this.expanded.delete(id)
    else this.expanded.add(id)
  }

  // count all nested children (for top-level summary)
  countAllChildren(entry: LogEntry): number {
    if (!entry.children || entry.children.length === 0) return 0
    return entry.children.reduce((acc, c) => acc + 1 + this.countAllChildren(c), 0)
  }
}

