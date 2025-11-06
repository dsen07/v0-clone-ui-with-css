"use client"

import { useState } from "react"
import { JsonModal } from "./json-modal"
import type { LogEntry } from "./log-viewer"
import "./log-modal.css"

interface LogModalProps {
  log: LogEntry
  isOpen: boolean
  onClose: () => void
}

interface NestedLogItemProps {
  child: LogEntry
  level: number
}

function NestedLogItem({ child, level }: NestedLogItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [jsonModal, setJsonModal] = useState<{ type: "request" | "response"; data: any } | null>(null)

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

  const borderLeftWidth = level > 0 ? `${level * 2}px` : "0px"

  return (
    <>
      <div className="nested-log-item" style={{ borderLeftWidth, borderLeftColor: "#e5e7eb" }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="nested-log-header"
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <div className="nested-log-chevron">
            {isExpanded ? (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            ) : (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            )}
          </div>

          <div className="nested-log-info">
            <span className="nested-log-timestamp">{child.timestamp}</span>
            <span className="nested-log-endpoint">{child.endpoint}</span>
            <span className={`nested-log-method ${getMethodClass(child.method)}`}>{child.method}</span>
            <span className={`nested-log-status ${getStatusBadgeClass(child.status)}`}>{child.status}</span>
            <span className="nested-log-duration">{child.duration}ms</span>
          </div>

          {child.children && child.children.length > 0 && (
            <span className="nested-log-count">+{child.children.length}</span>
          )}
        </button>

        {isExpanded && (
          <div className="nested-log-expanded" style={{ paddingLeft: `${16 + level * 16}px` }}>
            <div className="nested-log-actions">
              <button
                className="log-action-button"
                onClick={(e) => {
                  e.stopPropagation()
                  setJsonModal({ type: "request", data: child.request })
                }}
              >
                <span className="action-indicator indicator-request"></span>
                View Request
              </button>
              <button
                className="log-action-button"
                onClick={(e) => {
                  e.stopPropagation()
                  setJsonModal({ type: "response", data: child.response })
                }}
              >
                <span className="action-indicator indicator-response"></span>
                View Response
              </button>
            </div>

            {child.children && child.children.length > 0 && (
              <div className="nested-children-container">
                {child.children.map((nestedChild) => (
                  <NestedLogItem key={nestedChild.id} child={nestedChild} level={level + 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {jsonModal && (
        <JsonModal
          title={`${child.endpoint} - ${jsonModal.type === "request" ? "Request" : "Response"}`}
          data={jsonModal.data}
          isOpen={true}
          onClose={() => setJsonModal(null)}
          type={jsonModal.type}
        />
      )}
    </>
  )
}

export function LogModal({ log, isOpen, onClose }: LogModalProps) {
  const [jsonModal, setJsonModal] = useState<{ type: "request" | "response"; data: any } | null>(null)

  if (!isOpen) return null

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

  const countAllChildren = (entry: LogEntry): number => {
    if (!entry.children || entry.children.length === 0) return 0
    return entry.children.reduce((acc, child) => acc + 1 + countAllChildren(child), 0)
  }

  const totalChildren = countAllChildren(log)

  return (
    <>
      <div className="log-modal-backdrop" onClick={onClose} />

      <div className="log-modal-container">
        <div className="log-modal">
          <div className="log-modal-header">
            <div className="log-modal-header-content">
              <h2 className="log-modal-title">Log Details</h2>
              <div className="log-modal-meta">
                <span className="log-meta-timestamp">{log.timestamp}</span>
                <span className={`log-meta-method ${getMethodClass(log.method)}`}>{log.method}</span>
                <span className="log-meta-endpoint">{log.endpoint}</span>
                <span className={`log-meta-status ${getStatusBadgeClass(log.status)}`}>{log.status}</span>
                <span className="log-meta-duration">{log.duration}ms</span>
              </div>
            </div>
            <button className="log-modal-close" onClick={onClose}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="log-modal-content">
            <div className="log-modal-section">
              <h3 className="log-section-title">Parent Log Data</h3>
              <div className="log-section-actions">
                <button
                  className="log-action-button"
                  onClick={() => setJsonModal({ type: "request", data: log.request })}
                >
                  <span className="action-indicator indicator-request"></span>
                  View Request
                </button>
                <button
                  className="log-action-button"
                  onClick={() => setJsonModal({ type: "response", data: log.response })}
                >
                  <span className="action-indicator indicator-response"></span>
                  View Response
                </button>
              </div>
            </div>

            {log.children && log.children.length > 0 && (
              <div className="log-children-section">
                <h3 className="log-children-title">
                  <span className="children-indicator"></span>
                  Child Operations ({totalChildren} total)
                </h3>
                <div className="log-children-container">
                  {log.children.map((child) => (
                    <NestedLogItem key={child.id} child={child} level={0} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {jsonModal && (
        <JsonModal
          title={`${log.endpoint} - ${jsonModal.type === "request" ? "Request" : "Response"}`}
          data={jsonModal.data}
          isOpen={true}
          onClose={() => setJsonModal(null)}
          type={jsonModal.type}
        />
      )}
    </>
  )
}
