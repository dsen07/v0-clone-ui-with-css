import { Injectable } from "@angular/core"
import { type HttpClient, HttpParams } from "@angular/common/http"
import { type Observable, delay } from "rxjs"

export interface User {
  id: number
  name: string
  email: string
  phone: string
}

@Injectable({
  providedIn: "root",
})
export class DataService {
  private apiUrl = "https://jsonplaceholder.typicode.com/users"

  constructor(private http: HttpClient) {}

  /**
   * Generic GET method to fetch data from any REST API endpoint
   * @param endpoint - The API endpoint URL
   * @param params - Optional query parameters as an object
   * @param addDelay - Optional delay in milliseconds for simulating loading
   * @returns Observable of the response data
   */
  get<T>(endpoint: string, params?: { [key: string]: string | number | boolean }, addDelay?: number): Observable<T> {
    let httpParams = new HttpParams()

    // Build query parameters if provided
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, String(params[key]))
      })
    }

    const request = this.http.get<T>(endpoint, { params: httpParams })

    // Add optional delay for loading simulation
    return addDelay ? request.pipe(delay(addDelay)) : request
  }

  // Specific method using the generic GET method
  getUsers(): Observable<User[]> {
    return this.get<User[]>(this.apiUrl, undefined, 1000)
  }
}



import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import type { LogEntry, LogStats } from "../models/log.model"

@Injectable({
  providedIn: "root",
})
export class LogService {
  private logsSubject = new BehaviorSubject<LogEntry[]>(this.getMockLogs())
  private searchQuerySubject = new BehaviorSubject<string>("")

  logs$: Observable<LogEntry[]> = this.logsSubject.asObservable()
  searchQuery$: Observable<string> = this.searchQuerySubject.asObservable()

  constructor() {}

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query)
  }

  getStats(logs: LogEntry[]): LogStats {
    const parentLogs = logs.length
    const childOperations = logs.reduce((acc, log) => acc + (log.children?.length || 0), 0)
    return {
      parentLogs,
      childOperations,
      filtered: parentLogs,
    }
  }

  filterLogs(logs: LogEntry[], query: string): LogEntry[] {
    if (!query.trim()) return logs

    const lowerQuery = query.toLowerCase()
    return logs.filter(
      (log) =>
        log.endpoint.toLowerCase().includes(lowerQuery) ||
        log.method.toLowerCase().includes(lowerQuery) ||
        log.status.toString().includes(lowerQuery) ||
        log.id.toString().includes(lowerQuery),
    )
  }

  private getMockLogs(): LogEntry[] {
    return [
      {
        id: 1,
        endpoint: "/api/users/create",
        method: "POST",
        status: 201,
        timestamp: "2025-01-15 14:32:18.234",
        duration: 145,
        request: { name: "John Doe", email: "john@example.com" },
        response: { id: 123, name: "John Doe", email: "john@example.com", created: true },
        headers: { "Content-Type": "application/json", Authorization: "Bearer token123" },
        children: [
          {
            id: 11,
            endpoint: "/api/users/validate",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:32:18.250",
            duration: 23,
            request: { email: "john@example.com" },
            response: { valid: true },
          },
          {
            id: 12,
            endpoint: "/api/database/insert",
            method: "POST",
            status: 201,
            timestamp: "2025-01-15 14:32:18.280",
            duration: 89,
            request: { table: "users", data: { name: "John Doe" } },
            response: { inserted: true, id: 123 },
          },
          {
            id: 13,
            endpoint: "/api/email/send",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:32:18.320",
            duration: 33,
            request: { to: "john@example.com", template: "welcome" },
            response: { sent: true },
          },
        ],
      },
      {
        id: 2,
        endpoint: "/api/products?category=electronics&limit=20",
        method: "GET",
        status: 200,
        timestamp: "2025-01-15 14:31:45.123",
        duration: 89,
        request: null,
        response: { products: [], total: 20, page: 1 },
        headers: { "Content-Type": "application/json" },
        queryParams: { category: "electronics", limit: "20" },
        children: [
          {
            id: 21,
            endpoint: "/api/database/query",
            method: "GET",
            status: 200,
            timestamp: "2025-01-15 14:31:45.140",
            duration: 67,
            request: { query: "SELECT * FROM products WHERE category = ?" },
            response: { rows: 20 },
          },
          {
            id: 22,
            endpoint: "/api/cache/set",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:31:45.180",
            duration: 12,
            request: { key: "products:electronics", ttl: 300 },
            response: { cached: true },
          },
          {
            id: 23,
            endpoint: "/api/analytics/track",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:31:45.200",
            duration: 10,
            request: { event: "product_list_view", category: "electronics" },
            response: { tracked: true },
          },
        ],
      },
      {
        id: 3,
        endpoint: "/api/sessions/usr_9876543210",
        method: "DELETE",
        status: 204,
        timestamp: "2025-01-15 14:30:12.567",
        duration: 34,
        request: null,
        response: null,
        headers: { Authorization: "Bearer token456" },
        children: [
          {
            id: 31,
            endpoint: "/api/database/delete",
            method: "DELETE",
            status: 200,
            timestamp: "2025-01-15 14:30:12.580",
            duration: 28,
            request: { table: "sessions", id: "usr_9876543210" },
            response: { deleted: true },
          },
          {
            id: 32,
            endpoint: "/api/cache/invalidate",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:30:12.595",
            duration: 6,
            request: { key: "session:usr_9876543210" },
            response: { invalidated: true },
          },
        ],
      },
      {
        id: 4,
        endpoint: "/api/orders/ord_555/status",
        method: "PUT",
        status: 200,
        timestamp: "2025-01-15 14:29:33.891",
        duration: 112,
        request: { status: "shipped", tracking: "TRACK123" },
        response: { updated: true, order: { id: "ord_555", status: "shipped" } },
        headers: { "Content-Type": "application/json" },
        children: [
          {
            id: 41,
            endpoint: "/api/database/update",
            method: "PUT",
            status: 200,
            timestamp: "2025-01-15 14:29:33.910",
            duration: 45,
            request: { table: "orders", id: "ord_555", data: { status: "shipped" } },
            response: { updated: true },
          },
          {
            id: 42,
            endpoint: "/api/email/send",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:29:33.960",
            duration: 38,
            request: { to: "customer@example.com", template: "order_shipped" },
            response: { sent: true },
          },
          {
            id: 43,
            endpoint: "/api/notifications/push",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:29:33.990",
            duration: 29,
            request: { userId: "usr_123", message: "Your order has shipped!" },
            response: { sent: true },
          },
        ],
      },
      {
        id: 5,
        endpoint: "/api/auth/login",
        method: "POST",
        status: 401,
        timestamp: "2025-01-15 14:28:05.234",
        duration: 67,
        request: { email: "user@example.com", password: "***" },
        response: { error: "Invalid credentials" },
        headers: { "Content-Type": "application/json" },
        children: [
          {
            id: 51,
            endpoint: "/api/database/query",
            method: "GET",
            status: 200,
            timestamp: "2025-01-15 14:28:05.250",
            duration: 34,
            request: { query: "SELECT * FROM users WHERE email = ?" },
            response: { rows: 1 },
          },
          {
            id: 52,
            endpoint: "/api/auth/verify",
            method: "POST",
            status: 401,
            timestamp: "2025-01-15 14:28:05.280",
            duration: 22,
            request: { hash: "***", password: "***" },
            response: { valid: false },
          },
          {
            id: 53,
            endpoint: "/api/analytics/track",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:28:05.295",
            duration: 11,
            request: { event: "login_failed", email: "user@example.com" },
            response: { tracked: true },
          },
        ],
      },
      {
        id: 6,
        endpoint: "/api/analytics/dashboard",
        method: "GET",
        status: 500,
        timestamp: "2025-01-15 14:27:22.456",
        duration: 2345,
        request: null,
        response: { error: "Database connection timeout" },
        headers: { "Content-Type": "application/json" },
        children: [
          {
            id: 61,
            endpoint: "/api/database/connect",
            method: "GET",
            status: 500,
            timestamp: "2025-01-15 14:27:22.470",
            duration: 2300,
            request: { host: "db.example.com" },
            response: { error: "Connection timeout" },
          },
          {
            id: 62,
            endpoint: "/api/monitoring/alert",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:27:24.780",
            duration: 34,
            request: { severity: "critical", message: "Database timeout" },
            response: { alerted: true },
          },
          {
            id: 63,
            endpoint: "/api/cache/get",
            method: "GET",
            status: 404,
            timestamp: "2025-01-15 14:27:24.820",
            duration: 11,
            request: { key: "dashboard:cache" },
            response: { found: false },
          },
        ],
      },
      {
        id: 7,
        endpoint: "/api/payments/process",
        method: "POST",
        status: 200,
        timestamp: "2025-01-15 14:26:15.789",
        duration: 456,
        request: { amount: 99.99, currency: "USD", method: "card" },
        response: { success: true, transactionId: "txn_789" },
        headers: { "Content-Type": "application/json" },
        children: [
          {
            id: 71,
            endpoint: "/api/stripe/charge",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:26:15.810",
            duration: 389,
            request: { amount: 9999, currency: "usd" },
            response: { id: "ch_123", status: "succeeded" },
          },
          {
            id: 72,
            endpoint: "/api/database/insert",
            method: "POST",
            status: 201,
            timestamp: "2025-01-15 14:26:16.200",
            duration: 34,
            request: { table: "transactions", data: { amount: 99.99 } },
            response: { inserted: true, id: "txn_789" },
          },
          {
            id: 73,
            endpoint: "/api/email/send",
            method: "POST",
            status: 200,
            timestamp: "2025-01-15 14:26:16.240",
            duration: 33,
            request: { to: "customer@example.com", template: "payment_receipt" },
            response: { sent: true },
          },
        ],
      },
    ]
  }
}
