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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LogEntry, JsonModalData } from '../../models/log.model';

@Component({
  selector: 'app-log-modal',
  templateUrl: './log-modal.component.html',
  styleUrls: ['./log-modal.component.css']
})
export class LogModalComponent {
  @Input() log!: LogEntry;
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onOpenJson = new EventEmitter<JsonModalData>();

  jsonModalData: JsonModalData | null = null;

  close() {
    this.onClose.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  viewRequest(log: LogEntry) {
    this.onOpenJson.emit({
      type: 'request',
      data: log.request,
      title: `${log.endpoint} - Request`
    });
  }

  viewResponse(log: LogEntry) {
    this.onOpenJson.emit({
      type: 'response',
      data: log.response,
      title: `${log.endpoint} - Response`
    });
  }

  getStatusIcon(status: number, endpoint: string): string {
    // Custom logic based on your requirements
    if (status === 200) return '✓';
    if (endpoint.includes('db')) return '●';
    return '➢';
  }

  getStatusIconClass(status: number, endpoint: string): string {
    if (status === 200) return 'status-success';
    if (endpoint.includes('db')) return 'status-pending';
    return 'status-running';
  }

  getMethodClass(method: string): string {
    const methodMap: Record<string, string> = {
      GET: 'method-get',
      POST: 'method-post',
      PUT: 'method-put',
      DELETE: 'method-delete',
      PATCH: 'method-patch'
    };
    return methodMap[method] || 'method-get';
  }

  countAllChildren(entry: LogEntry): number {
    if (!entry.children || entry.children.length === 0) return 0;
    return entry.children.reduce((acc, child) => acc + 1 + this.countAllChildren(child), 0);
  }

  get totalChildren(): number {
    return this.countAllChildren(this.log);
  }

  toggleChildExpansion(child: LogEntry) {
    child.expanded = !child.expanded;
  }
}
