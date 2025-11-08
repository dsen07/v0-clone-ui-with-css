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


import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ListModalComponent } from "./components/list-modal/list-modal.component"
import { DetailModalComponent } from "./components/detail-modal/detail-modal.component"
import type { DataService } from "./services/data.service"

export interface ApiEndpoint {
  id: number
  name: string
  url: string
  description: string
}

export interface DetailData {
  id: number
  title: string
  body: string
  userId: number
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, ListModalComponent, DetailModalComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  isListModalOpen = false
  isDetailModalOpen = false

  listData: ApiEndpoint[] = []
  detailData: DetailData | null = null

  loadingList = false
  loadingDetail = false

  listError: string | null = null
  detailError: string | null = null

  constructor(private dataService: DataService) {}

  openListModal(): void {
    this.isListModalOpen = true
    this.fetchListData()
  }

  fetchListData(): void {
    this.loadingList = true
    this.listError = null

    // Simulated list of API endpoints
    // In real scenario, this would be fetched from your backend
    setTimeout(() => {
      this.listData = [
        {
          id: 1,
          name: "Post 1",
          url: "https://jsonplaceholder.typicode.com/posts/1",
          description: "Details for post 1",
        },
        {
          id: 2,
          name: "Post 2",
          url: "https://jsonplaceholder.typicode.com/posts/2",
          description: "Details for post 2",
        },
        {
          id: 3,
          name: "Post 3",
          url: "https://jsonplaceholder.typicode.com/posts/3",
          description: "Details for post 3",
        },
        {
          id: 4,
          name: "Post 4",
          url: "https://jsonplaceholder.typicode.com/posts/4",
          description: "Details for post 4",
        },
        {
          id: 5,
          name: "Post 5",
          url: "https://jsonplaceholder.typicode.com/posts/5",
          description: "Details for post 5",
        },
      ]
      this.loadingList = false
    }, 1000)
  }

  onListItemClick(item: ApiEndpoint): void {
    this.isDetailModalOpen = true
    this.fetchDetailData(item.url)
  }

  fetchDetailData(url: string): void {
    this.loadingDetail = true
    this.detailError = null
    this.detailData = null

    this.dataService.get<DetailData>(url, undefined, 1500).subscribe({
      next: (data) => {
        this.detailData = data
        this.loadingDetail = false
      },
      error: (err) => {
        this.detailError = err.message || "Failed to load detail data"
        this.loadingDetail = false
      },
    })
  }

  closeListModal(): void {
    this.isListModalOpen = false
    this.listData = []
    this.listError = null
    this.loadingList = false
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false
    this.detailData = null
    this.detailError = null
    this.loadingDetail = false
  }
}


