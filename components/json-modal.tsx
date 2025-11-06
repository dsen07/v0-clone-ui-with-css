"use client"

import { useState } from "react"
import { JsonViewer } from "./json-viewer"
import "./json-modal.css"
import "./json-viewer.css"

interface JsonModalProps {
  title: string
  data: any
  isOpen: boolean
  onClose: () => void
  type: "request" | "response"
}

export function JsonModal({ title, data, isOpen, onClose, type }: JsonModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="json-modal-backdrop" onClick={onClose} />

      <div className="json-modal-container">
        <div className="json-modal">
          <div className="json-modal-header">
            <div className="json-modal-title-wrapper">
              <span
                className={`json-modal-indicator ${type === "request" ? "indicator-request" : "indicator-response"}`}
              ></span>
              <h2 className="json-modal-title">{title}</h2>
            </div>
            <div className="json-modal-actions">
              <button className="json-modal-button" onClick={copyToClipboard}>
                {copied ? (
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
                <span className="button-text">{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button className="json-modal-button" onClick={onClose}>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="json-modal-content">
            <JsonViewer data={data} />
          </div>
        </div>
      </div>
    </>
  )
}
