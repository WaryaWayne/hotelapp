"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, FileText, Receipt, Download, Trash2 } from "lucide-react"

interface RecentDocumentsProps {
  onClose: () => void
}

interface Document {
  id: string
  type: "invoice" | "quotation" | "receipt"
  title: string
  client: string
  amount: number
  date: string
  reference: string
}

export default function RecentDocuments({ onClose }: RecentDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    // Load recent documents from localStorage
    const loadRecentDocuments = () => {
      const recentDocs: Document[] = []

      // Load invoices
      const invoiceData = localStorage.getItem("invoiceData")
      if (invoiceData) {
        const invoice = JSON.parse(invoiceData)
        if (invoice.clientInfo?.name) {
          recentDocs.push({
            id: "invoice-1",
            type: "invoice",
            title: "Invoice",
            client: invoice.clientInfo.name,
            amount: invoice.items?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0,
            date: new Date().toLocaleDateString(),
            reference: invoice.referenceNumber || "N/A",
          })
        }
      }

      // Load quotations
      const quotationData = localStorage.getItem("quotationData")
      if (quotationData) {
        const quotation = JSON.parse(quotationData)
        if (quotation.clientInfo?.name) {
          recentDocs.push({
            id: "quotation-1",
            type: "quotation",
            title: "Quotation",
            client: quotation.clientInfo.name,
            amount: quotation.items?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0,
            date: new Date().toLocaleDateString(),
            reference: quotation.referenceNumber || "N/A",
          })
        }
      }

      // Load receipts
      const receiptData = localStorage.getItem("receiptBuilderData")
      if (receiptData) {
        const receipt = JSON.parse(receiptData)
        if (receipt.customerInfo?.name) {
          recentDocs.push({
            id: "receipt-1",
            type: "receipt",
            title: "Receipt",
            client: receipt.customerInfo.name,
            amount: receipt.paymentInfo?.amount || 0,
            date: new Date().toLocaleDateString(),
            reference: receipt.receiptNumber || "N/A",
          })
        }
      }

      setDocuments(recentDocs)
    }

    loadRecentDocuments()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return <FileText className="w-5 h-5 text-blue-500" />
      case "quotation":
        return <Receipt className="w-5 h-5 text-green-500" />
      case "receipt":
        return <Receipt className="w-5 h-5 text-purple-500" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
    // In a real app, you'd also delete from localStorage or database
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Recent Documents</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[60vh]">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent documents found</p>
              <p className="text-sm">Create your first invoice, quotation, or receipt to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getIcon(doc.type)}
                    <div>
                      <h3 className="font-medium">
                        {doc.title} - {doc.reference}
                      </h3>
                      <p className="text-sm text-gray-600">Client: {doc.client}</p>
                      <p className="text-sm text-gray-500">Date: {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">${doc.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 capitalize">{doc.type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteDocument(doc.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
