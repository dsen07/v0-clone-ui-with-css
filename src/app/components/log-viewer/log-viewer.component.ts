import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { Subject, combineLatest } from "rxjs"
import { takeUntil, map } from "rxjs/operators"
import type { LogService } from "../../services/log.service"
import type { LogEntry, LogStats } from "../../models/log.model"

@Component({
  selector: "app-log-viewer",
  templateUrl: "./log-viewer.component.html",
  styleUrls: ["./log-viewer.component.css"],
})
export class LogViewerComponent implements OnInit, OnDestroy {
  logs: LogEntry[] = []
  filteredLogs: LogEntry[] = []
  stats: LogStats = { parentLogs: 0, childOperations: 0, filtered: 0 }
  searchQuery = ""
  expandedLogs = new Set<number>()
  selectedLog: LogEntry | null = null
  selectedChild: LogEntry | null = null
  showJsonModal = false
  jsonModalData: any = null
  jsonModalTitle = ""

  private destroy$ = new Subject<void>()

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    combineLatest([this.logService.logs$, this.logService.searchQuery$])
      .pipe(
        takeUntil(this.destroy$),
        map(([logs, query]) => {
          this.logs = logs
          this.searchQuery = query
          return this.logService.filterLogs(logs, query)
        }),
      )
      .subscribe((filtered) => {
        this.filteredLogs = filtered
        this.stats = this.logService.getStats(filtered)
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value
    this.logService.setSearchQuery(query)
  }

  toggleExpand(logId: number, event: Event): void {
    event.stopPropagation()
    if (this.expandedLogs.has(logId)) {
      this.expandedLogs.delete(logId)
    } else {
      this.expandedLogs.add(logId)
    }
  }

  isExpanded(logId: number): boolean {
    return this.expandedLogs.has(logId)
  }

  isHighlighted(logId: number): boolean {
    return this.expandedLogs.has(logId) || this.selectedLog?.id === logId
  }

  openLogModal(log: LogEntry, event: Event): void {
    event.stopPropagation()
    this.selectedLog = log
    this.selectedChild = null
  }

  openChildModal(parent: LogEntry, child: LogEntry, event: Event): void {
    event.stopPropagation()
    this.selectedLog = parent
    this.selectedChild = child
  }

  closeLogModal(): void {
    this.selectedLog = null
    this.selectedChild = null
  }

  openJsonModal(data: any, title: string): void {
    this.jsonModalData = data
    this.jsonModalTitle = title
    this.showJsonModal = true
  }

  closeJsonModal(): void {
    this.showJsonModal = false
    this.jsonModalData = null
    this.jsonModalTitle = ""
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
}
