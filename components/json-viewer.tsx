"use client"

interface JsonViewerProps {
  data: any
}

export function JsonViewer({ data }: JsonViewerProps) {
  const jsonString = JSON.stringify(data, null, 2)

  return (
    <div className="json-viewer">
      <pre className="json-pre">
        <code className="json-code">{jsonString}</code>
      </pre>
    </div>
  )
}
