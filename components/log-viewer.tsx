"use client"

import type React from "react"

import { useState } from "react"
import { LogModal } from "./log-modal"
import "./log-viewer.css"

export interface LogEntry {
  id: string
  timestamp: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  endpoint: string
  status: number
  duration: number
  request: Record<string, any>
  response: Record<string, any>
  children?: LogEntry[]
}

interface LogViewerProps {
  logs: LogEntry[]
}

export function LogViewer({ logs }: LogViewerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

  const getStatusBadgeClass = (status: number) => {
    if (status >= 200 && status < 300) return "status-success"
    if (status >= 400 && status < 500) return "status-warning"
    if (status >= 500) return "status-error"
    return "status-info"
  }

  const getMethodClass = (method: string) => {
    const methodMap: Record<string, string> = {
      GET: "method-get",
      POST: "method-post",
      PUT: "method-put",
      DELETE: "method-delete",
      PATCH: "method-patch",
    }
    return methodMap[method] || "method-get"
  }

  const toggleExpand = (logId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedLogs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(logId)) {
        newSet.delete(logId)
      } else {
        newSet.add(logId)
      }
      return newSet
    })
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.status.toString().includes(searchQuery) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalChildren = logs.reduce((acc, log) => acc + (log.children?.length || 0), 0)

  const renderLogItem = (log: LogEntry, isChild = false) => {
    const isExpanded = expandedLogs.has(log.id)
    const isActive = selectedLog?.id === log.id || isExpanded

    return (
      <div key={log.id} className={isChild ? "child-log-wrapper" : ""}>
        <button
          onClick={() => setSelectedLog(log)}
          className={`log-item ${isActive ? "log-item-active" : ""} ${isChild ? "log-item-child" : ""}`}
        >
          {log.children && log.children.length > 0 && (
            <svg
              className={`log-chevron ${isExpanded ? "log-chevron-expanded" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              onClick={(e) => toggleExpand(log.id, e)}
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          )}
          {(!log.children || log.children.length === 0) && (
            <svg
              className="log-chevron log-chevron-hidden"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          )}

          <div className="log-details">
            <div className="log-endpoint">{log.endpoint}</div>

            <div className="log-metadata">
              <div className="metadata-item">
                <span className="metadata-label">ID:</span>
                <span className="metadata-value">{log.id}</span>
              </div>

              <div className="metadata-item">
                <span className="metadata-label">Time:</span>
                <span className="metadata-value">{log.timestamp}</span>
              </div>

              <div className="metadata-item">
                <span className="metadata-label">Method:</span>
                <span className={`metadata-badge ${getMethodClass(log.method)}`}>{log.method}</span>
              </div>

              <div className="metadata-item">
                <span className="metadata-label">Status:</span>
                <span className={`metadata-badge ${getStatusBadgeClass(log.status)}`}>{log.status}</span>
              </div>

              <div className="metadata-item">
                <span className="metadata-label">Duration:</span>
                <span className="metadata-value">{log.duration}ms</span>
              </div>
            </div>

            {log.children && log.children.length > 0 && (
              <div className="log-children-badge">
                <span className="children-count">{log.children.length}</span>
                <span className="children-text">child operation{log.children.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </button>

        {isExpanded && log.children && log.children.length > 0 && (
          <div className="children-container">{log.children.map((child) => renderLogItem(child, true))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="log-viewer">
      <div className="log-viewer-header">
        <div className="header-content">
          <h1 className="header-title">Request Logs</h1>
          <p className="header-subtitle">Monitor and investigate API request/response logs</p>
        </div>

        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search by ID, endpoint, method, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="stats-bar">
        <div className="stats-content">
          <span className="stat-item">
            <strong className="stat-value">{logs.length}</strong> parent logs
          </span>
          <span className="stat-item">
            <strong className="stat-value">{totalChildren}</strong> child operations
          </span>
          <span className="stat-item">
            <strong className="stat-value">{filteredLogs.length}</strong> filtered
          </span>
        </div>
      </div>

      <div className="log-list">
        <div className="log-list-content">{filteredLogs.map((log) => renderLogItem(log))}</div>

        {filteredLogs.length === 0 && <div className="empty-state">No logs found matching your search.</div>}
      </div>

      {selectedLog && <LogModal log={selectedLog} isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  )
}
