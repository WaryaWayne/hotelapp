"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, RefreshCw, FileText, Plus } from "lucide-react"
import SignatureCanvas from "@/components/ui/custom/signature-canvas"
import LogoUpload from "@/components/ui/custom/logo-upload"
import { generateSecurePDF } from "@/components/ui/custom/pdf-generator"

interface ReceiptBuilderProps {
  onBack: () => void
}

export default function ReceiptBuilder({ onBack }: ReceiptBuilderProps) {
  const [receiptMode, setReceiptMode] = useState<"new" | "from-invoice" | null>(null)
  const [template, setTemplate] = useState("standard")
  const [receiptNumber, setReceiptNumber] = useState(generateReceiptNumber())
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [paymentInfo, setPaymentInfo] = useState({
    amount: 0,
    method: "",
    reference: "",
    description: "",
  })
  const [signature, setSignature] = useState<string | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [documentStyle, setDocumentStyle] = useState({
    font: "Arial",
    fontSize: "12",
  })
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [invoiceReference, setInvoiceReference] = useState("")

  useEffect(() => {
    // Load data from localStorage
    const storedData = localStorage.getItem("receiptBuilderData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setTemplate(parsedData.template || "standard")
      setReceiptNumber(parsedData.receiptNumber || generateReceiptNumber())
      setCustomerInfo(parsedData.customerInfo || { name: "", email: "", phone: "" })
      setPaymentInfo(parsedData.paymentInfo || { amount: 0, method: "", reference: "", description: "" })
      setSignature(parsedData.signature || null)
      setLogo(parsedData.logo || null)
      setDocumentStyle(parsedData.documentStyle || { font: "Arial", fontSize: "12" })
      setAdditionalNotes(parsedData.additionalNotes || "")
    }
  }, [])

  useEffect(() => {
    // Save data to localStorage
    const dataToStore = {
      template,
      receiptNumber,
      customerInfo,
      paymentInfo,
      signature,
      logo,
      documentStyle,
      additionalNotes,
    }
    localStorage.setItem("receiptBuilderData", JSON.stringify(dataToStore))
  }, [template, receiptNumber, customerInfo, paymentInfo, signature, logo, documentStyle, additionalNotes])

  function generateReceiptNumber(): string {
    return "RC" + Math.floor(100000 + Math.random() * 900000).toString()
  }

  const loadFromInvoice = () => {
    const invoiceData = localStorage.getItem("invoiceData")
    if (invoiceData) {
      const invoice = JSON.parse(invoiceData)

      // Load client info from invoice
      setCustomerInfo({
        name: invoice.clientInfo?.name || "",
        email: invoice.clientInfo?.email || "",
        phone: invoice.clientInfo?.phone || "",
      })

      // Calculate total from invoice items
      const total =
        invoice.items?.reduce((sum: number, item: any) => {
          return sum + (item.amount || 0)
        }, 0) || 0

      // Apply discount and tax
      const discount = invoice.discount || 0
      const taxRate = invoice.taxRate || 0
      const discountAmount = (total * discount) / 100
      const taxAmount = ((total - discountAmount) * taxRate) / 100
      const finalTotal = total - discountAmount + taxAmount

      setPaymentInfo({
        amount: finalTotal,
        method: "",
        reference: invoice.referenceNumber || "",
        description: `Payment for Invoice ${invoice.referenceNumber || ""}`,
      })

      setInvoiceReference(invoice.referenceNumber || "")
      alert("Invoice data loaded successfully!")
    } else {
      alert("No invoice data found. Please create an invoice first.")
    }
  }

  const downloadPDF = async () => {
    const success = await generateSecurePDF({
      elementId: "receipt-preview",
      filename: `Receipt-${receiptNumber}.pdf`,
    })

    if (success) {
      alert("PDF downloaded successfully!")
    }
  }

  const templates = [
    { id: "standard", name: "Standard Receipt", color: "bg-green-50 border-green-200" },
    { id: "thermal", name: "Thermal Style", color: "bg-gray-50 border-gray-200" },
    { id: "formal", name: "Formal Receipt", color: "bg-blue-50 border-blue-200" },
  ]

  const paymentMethods = ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Mobile Payment", "Check"]

  const fontOptions = ["Arial", "Helvetica", "Times New Roman", "Courier New"]
  const fontSizeOptions = ["10", "12", "14", "16", "18"]

  // Initial mode selection
  if (receiptMode === null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Receipt Builder</h1>
        </div>

        <div className="flex justify-center items-center min-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setReceiptMode("new")}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Create New Receipt</CardTitle>
                <p className="text-gray-600">Start with a blank receipt form</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Create New Receipt</Button>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setReceiptMode("from-invoice")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">From Existing Invoice</CardTitle>
                <p className="text-gray-600">Create receipt from a saved invoice</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={loadFromInvoice}>
                  Load from Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setReceiptMode(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Selection
        </Button>
        <h1 className="text-3xl font-bold">
          Receipt Builder {receiptMode === "from-invoice" && invoiceReference && `(From Invoice: ${invoiceReference})`}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Company Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Company Logo (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <LogoUpload onLogoChange={setLogo} currentLogo={logo} />
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Template Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {templates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      template === tmpl.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => setTemplate(tmpl.id)}
                  >
                    <div className={`h-20 rounded ${tmpl.color} mb-2`}></div>
                    <p className="text-sm font-medium">{tmpl.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Styling */}
          <Card>
            <CardHeader>
              <CardTitle>Document Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="font">Font</Label>
                <Select
                  value={documentStyle.font}
                  onValueChange={(value) => setDocumentStyle({ ...documentStyle, font: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={documentStyle.fontSize}
                  onValueChange={(value) => setDocumentStyle({ ...documentStyle, fontSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Number */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Receipt Number
                <Button variant="outline" size="sm" onClick={() => setReceiptNumber(generateReceiptNumber())}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount Received</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={paymentInfo.amount}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, amount: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="method">Payment Method</Label>
                  <Select
                    value={paymentInfo.method}
                    onValueChange={(value) => setPaymentInfo({ ...paymentInfo, method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="reference">Payment Reference</Label>
                <Input
                  id="reference"
                  value={paymentInfo.reference}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, reference: e.target.value })}
                  placeholder="Transaction ID, Check number, etc."
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={paymentInfo.description}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, description: e.target.value })}
                  placeholder="Payment for room booking, services, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                id="additionalNotes"
                placeholder="Any additional notes to include on the receipt"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Signature */}
          <Card>
            <CardHeader>
              <CardTitle>Received By (Signature)</CardTitle>
            </CardHeader>
            <CardContent>
              <SignatureCanvas onSignatureChange={setSignature} />
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                id="receipt-preview"
                className={`p-6 border-2 rounded-lg ${templates.find((t) => t.id === template)?.color}`}
              >
                <div
                  className="space-y-4"
                  style={{ fontFamily: documentStyle.font, fontSize: `${documentStyle.fontSize}px` }}
                >
                  <div className="flex justify-between items-center">
                    {logo ? (
                      <img
                        src={logo || "/placeholder.svg"}
                        alt="Company Logo"
                        className="max-h-16 max-w-[150px] object-contain"
                      />
                    ) : (
                      <div></div>
                    )}
                    <div className="text-right">
                      <h2 className="text-2xl font-bold">Grand Hotel</h2>
                      <p className="text-sm text-gray-600">123 Hotel Street, City, State 12345</p>
                      <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 text-center">
                    <h3 className="text-xl font-bold">PAYMENT RECEIPT</h3>
                    <p className="text-sm">Receipt No: {receiptNumber}</p>
                    <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-sm">Time: {new Date().toLocaleTimeString()}</p>
                    {invoiceReference && <p className="text-sm">Related Invoice: {invoiceReference}</p>}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold">Received From:</h4>
                    <p className="text-sm">{customerInfo.name || "Customer Name"}</p>
                    <p className="text-sm">{customerInfo.email}</p>
                    <p className="text-sm">{customerInfo.phone}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold">Payment Details:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-bold">${paymentInfo.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span>{paymentInfo.method || "Not specified"}</span>
                      </div>
                      {paymentInfo.reference && (
                        <div className="flex justify-between">
                          <span>Reference:</span>
                          <span>{paymentInfo.reference}</span>
                        </div>
                      )}
                      {paymentInfo.description && (
                        <div className="mt-2">
                          <span className="font-semibold">For:</span>
                          <p className="text-sm">{paymentInfo.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {additionalNotes && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold">Notes:</h4>
                      <p className="text-sm">{additionalNotes}</p>
                    </div>
                  )}

                  <div className="border-t pt-4 text-center">
                    <div className="bg-green-100 p-2 rounded">
                      <p className="text-lg font-bold text-green-800">PAID IN FULL</p>
                    </div>
                  </div>

                  {signature && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold">Received by:</p>
                      <img src={signature || "/placeholder.svg"} alt="Signature" className="h-16 mt-2" />
                      <p className="text-xs text-gray-600 mt-1">Authorized Representative</p>
                    </div>
                  )}

                  <div className="border-t pt-4 text-center">
                    <p className="text-xs text-gray-600">Thank you for your business!</p>
                    <p className="text-xs text-gray-600">This is a computer-generated receipt.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={downloadPDF} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Secure PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
// This function generates a secure PDF from the receipt preview element