export interface LogEntry {
  id: number
  endpoint: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  status: number
  timestamp: string
  duration: number
  children?: LogEntry[]
  request?: any
  response?: any
  headers?: Record<string, string>
  queryParams?: Record<string, string>
}

export interface LogStats {
  parentLogs: number
  childOperations: number
  filtered: number
}

export interface JsonModalData {
  type: 'request' | 'response';
  data: any;
  title: string;
}
