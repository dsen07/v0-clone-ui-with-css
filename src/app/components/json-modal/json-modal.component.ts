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


import { Component, Input, Output, EventEmitter, type OnChanges, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { DataService, User } from "../../services/data.service"

@Component({
  selector: "app-data-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./data-modal.component.html",
  styleUrls: ["./data-modal.component.css"],
})
export class DataModalComponent implements OnChanges {
  @Input() open = false
  @Output() onClose = new EventEmitter<void>()

  loading = false
  data: User[] = []
  error: string | null = null

  constructor(private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // When modal opens, fetch data
    if (changes["open"] && this.open) {
      this.fetchData()
    } else if (changes["open"] && !this.open) {
      // Reset state when modal closes
      this.resetState()
    }
  }

  fetchData(): void {
    this.loading = true
    this.error = null

    // Example 1: Get users (no parameters)
    this.dataService.get<User[]>("https://jsonplaceholder.typicode.com/users", undefined, 1000).subscribe({
      next: (users) => {
        this.data = users
        this.loading = false
      },
      error: (err) => {
        this.error = err.message || "An error occurred while fetching data"
        this.loading = false
      },
    })

    // Example 2: Get users with parameters (uncomment to use)
    // this.dataService.get<User[]>("https://jsonplaceholder.typicode.com/users", { id: 1 }, 1000).subscribe({
    //   next: (users) => {
    //     this.data = users
    //     this.loading = false
    //   },
    //   error: (err) => {
    //     this.error = err.message || "An error occurred while fetching data"
    //     this.loading = false
    //   },
    // })

    // Example 3: Get posts with pagination parameters (uncomment to use)
    // interface Post { id: number; title: string; body: string; userId: number }
    // this.dataService.get<Post[]>("https://jsonplaceholder.typicode.com/posts", { _limit: 10, _page: 1 }, 1000).subscribe({
    //   next: (posts) => {
    //     console.log('[v0] Posts:', posts)
    //     this.loading = false
    //   },
    //   error: (err) => {
    //     this.error = err.message || "An error occurred while fetching data"
    //     this.loading = false
    //   },
    // })
  }

  resetState(): void {
    this.data = []
    this.error = null
    this.loading = false
  }

  closeModal(): void {
    this.onClose.emit()
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal()
    }
  }
}

