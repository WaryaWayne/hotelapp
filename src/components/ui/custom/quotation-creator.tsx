"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2, Download, RefreshCw, GripVertical } from "lucide-react"
import SignatureCanvas from "@/components/ui/custom/signature-canvas"
import LogoUpload from "@/components/ui/custom/logo-upload"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"

interface QuotationCreatorProps {
  onBack: () => void
}

interface QuotationItem {
  id: string
  service: string
  description: string
  quantity: number
  rate: number
  amount: number
  days: number // New field for number of days/frequency
}

export default function QuotationCreator({ onBack }: QuotationCreatorProps) {
  const [template, setTemplate] = useState("professional")
  const [referenceNumber, setReferenceNumber] = useState(generateReferenceNumber())
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    eventDate: "",
    eventType: "",
  })
  const [items, setItems] = useState<QuotationItem[]>([
    { id: "1", service: "", description: "", quantity: 1, rate: 0, amount: 0, days: 1 },
  ])
  const [validityPeriod, setValidityPeriod] = useState(30)
  const [terms, setTerms] = useState(
    "This quotation is valid for 30 days from the date of issue. A 50% deposit is required to confirm the booking.",
  )
  const [signature, setSignature] = useState<string | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [documentStyle, setDocumentStyle] = useState({
    font: "Arial",
    fontSize: "12",
    primaryColor: "#000000",
    secondaryColor: "#666666",
  })
  const [additionalNotes, setAdditionalNotes] = useState("")

  function generateReferenceNumber(): string {
    return "QT" + Math.floor(100000 + Math.random() * 900000).toString()
  }

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      service: "",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      days: 1,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "rate" || field === "days") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate * updatedItem.days
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  // Update all amounts when component loads
  useEffect(() => {
    setItems(
      items.map((item) => ({
        ...item,
        amount: item.quantity * item.rate * item.days,
      })),
    )
  }, [])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reorderedItems = Array.from(items)
    const [removed] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, removed)

    setItems(reorderedItems)
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0)

  const templates = [
    { id: "professional", name: "Professional", color: "bg-blue-50 border-blue-200" },
    { id: "luxury", name: "Luxury", color: "bg-gold-50 border-yellow-200" },
    { id: "minimalist", name: "Minimalist", color: "bg-gray-50 border-gray-200" },
  ]

  // Auto-save functionality
  useEffect(() => {
    localStorage.setItem(
      "quotationData",
      JSON.stringify({
        template,
        referenceNumber,
        clientInfo,
        items,
        validityPeriod,
        terms,
        signature,
        logo,
        documentStyle,
        additionalNotes,
      }),
    )
  }, [
    template,
    referenceNumber,
    clientInfo,
    items,
    validityPeriod,
    terms,
    signature,
    logo,
    documentStyle,
    additionalNotes,
  ])

  // Load data on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("quotationData")
    if (storedData) {
      const {
        template: storedTemplate,
        referenceNumber: storedReferenceNumber,
        clientInfo: storedClientInfo,
        items: storedItems,
        validityPeriod: storedValidityPeriod,
        terms: storedTerms,
        signature: storedSignature,
        logo: storedLogo,
        documentStyle: storedDocumentStyle,
        additionalNotes: storedAdditionalNotes,
      } = JSON.parse(storedData)

      setTemplate(storedTemplate)
      setReferenceNumber(storedReferenceNumber)
      setClientInfo(storedClientInfo)
      setItems(storedItems)
      setValidityPeriod(storedValidityPeriod)
      setTerms(storedTerms)
      setSignature(storedSignature)
      setLogo(storedLogo)
      setDocumentStyle(storedDocumentStyle)
      setAdditionalNotes(storedAdditionalNotes)
    }
  }, [])

  const fontOptions = [
    { id: "Arial", name: "Arial" },
    { id: "Helvetica", name: "Helvetica" },
    { id: "Times New Roman", name: "Times New Roman" },
    { id: "Courier New", name: "Courier New" },
  ]

  const fontSizeOptions = [
    { id: "10", name: "10" },
    { id: "12", name: "12" },
    { id: "14", name: "14" },
    { id: "16", name: "16" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Quotation Creator</h1>
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
                <select
                  id="font"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={documentStyle.font}
                  onChange={(e) => setDocumentStyle({ ...documentStyle, font: e.target.value })}
                >
                  {fontOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <select
                  id="fontSize"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={documentStyle.fontSize}
                  onChange={(e) => setDocumentStyle({ ...documentStyle, fontSize: e.target.value })}
                >
                  {fontSizeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  type="color"
                  id="primaryColor"
                  value={documentStyle.primaryColor}
                  onChange={(e) => setDocumentStyle({ ...documentStyle, primaryColor: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  type="color"
                  id="secondaryColor"
                  value={documentStyle.secondaryColor}
                  onChange={(e) => setDocumentStyle({ ...documentStyle, secondaryColor: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reference Number */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Quotation Reference
                <Button variant="outline" size="sm" onClick={() => setReferenceNumber(generateReferenceNumber())}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client & Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Input
                    id="eventType"
                    value={clientInfo.eventType}
                    onChange={(e) => setClientInfo({ ...clientInfo, eventType: e.target.value })}
                    placeholder="Wedding, Conference, Birthday..."
                  />
                </div>
                <div>
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={clientInfo.eventDate}
                    onChange={(e) => setClientInfo({ ...clientInfo, eventDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="clientAddress">Address</Label>
                <Textarea
                  id="clientAddress"
                  value={clientInfo.address}
                  onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services & Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="quotation-items">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border rounded-lg p-4 bg-white relative"
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move text-gray-400 hover:text-gray-600"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>

                              <div className="ml-8 space-y-3">
                                <div className="grid grid-cols-12 gap-2">
                                  <div className="col-span-12">
                                    <Label>Service Name</Label>
                                    <Input
                                      value={item.service}
                                      onChange={(e) => updateItem(item.id, "service", e.target.value)}
                                      placeholder="Room booking, Catering..."
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-12 gap-2">
                                  <div className="col-span-3">
                                    <Label>Quantity</Label>
                                    <Input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) =>
                                        updateItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)
                                      }
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Label>Days/Frequency</Label>
                                    <Input
                                      type="number"
                                      value={item.days}
                                      onChange={(e) =>
                                        updateItem(item.id, "days", Number.parseFloat(e.target.value) || 1)
                                      }
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Label>Rate</Label>
                                    <Input
                                      type="number"
                                      value={item.rate}
                                      onChange={(e) =>
                                        updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)
                                      }
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Label>Amount</Label>
                                    <Input value={`$${item.amount.toFixed(2)}`} readOnly />
                                  </div>
                                </div>

                                <div>
                                  <Label>Description</Label>
                                  <Input
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                    placeholder="Detailed description of the service..."
                                  />
                                </div>

                                <div className="flex justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                    disabled={items.length === 1}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove Service
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any extra information to add to the quotation..."
                rows={4}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="validity">Validity Period (days)</Label>
                <Input
                  id="validity"
                  type="number"
                  value={validityPeriod}
                  onChange={(e) => setValidityPeriod(Number.parseInt(e.target.value) || 30)}
                />
              </div>
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea id="terms" value={terms} onChange={(e) => setTerms(e.target.value)} rows={4} />
              </div>
            </CardContent>
          </Card>

          {/* Signature */}
          <Card>
            <CardHeader>
              <CardTitle>Authorized Signature</CardTitle>
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
              <CardTitle>Quotation Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`p-6 border-2 rounded-lg ${templates.find((t) => t.id === template)?.color}`}
                style={{
                  fontFamily: documentStyle.font,
                  fontSize: `${documentStyle.fontSize}px`,
                  color: documentStyle.primaryColor,
                }}
              >
                <div className="space-y-4">
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
                      <h2 className="text-2xl font-bold" style={{ color: documentStyle.primaryColor }}>
                        Grand Hotel
                      </h2>
                      <p className="text-sm text-gray-600" style={{ color: documentStyle.secondaryColor }}>
                        123 Hotel Street, City, State 12345
                      </p>
                      <p className="text-sm text-gray-600" style={{ color: documentStyle.secondaryColor }}>
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-xl font-bold" style={{ color: documentStyle.primaryColor }}>
                      QUOTATION
                    </h3>
                    <p className="text-sm" style={{ color: documentStyle.secondaryColor }}>
                      Reference: {referenceNumber}
                    </p>
                    <p className="text-sm" style={{ color: documentStyle.secondaryColor }}>
                      Date: {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-sm" style={{ color: documentStyle.secondaryColor }}>
                      Valid until: {new Date(Date.now() + validityPeriod * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold" style={{ color: documentStyle.primaryColor }}>
                      Client Details:
                    </h4>
                    <p className="text-sm" style={{ color: documentStyle.secondaryColor }}>
                      {clientInfo.name || "Client Name"}
                    </p>
                    <p className="text-sm" style={{ color: documentStyle.secondaryColor }}>
                      {clientInfo.email}
                    </p>
                    <p className="text-sm" style={{ color: documentStyle.secondaryColor }}>
                      Event: {clientInfo.eventType}
                    </p>
                    <p className="text-sm" style={{ color: documentStyle.secondaryColor }}>
                      Date: {clientInfo.eventDate}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2" style={{ color: documentStyle.primaryColor }}>
                      Services:
                    </h4>
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left py-2" style={{ color: documentStyle.secondaryColor }}>
                            Service
                          </th>
                          <th className="text-right py-2" style={{ color: documentStyle.secondaryColor }}>
                            Qty
                          </th>
                          <th className="text-right py-2" style={{ color: documentStyle.secondaryColor }}>
                            Days
                          </th>
                          <th className="text-right py-2" style={{ color: documentStyle.secondaryColor }}>
                            Rate
                          </th>
                          <th className="text-right py-2" style={{ color: documentStyle.secondaryColor }}>
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2" style={{ color: documentStyle.secondaryColor }}>
                              <div>{item.service || "Service name"}</div>
                              {item.description && (
                                <div
                                  className="text-xs text-gray-500 mt-1"
                                  style={{ color: documentStyle.secondaryColor }}
                                >
                                  {item.description}
                                </div>
                              )}
                            </td>
                            <td className="text-right py-2" style={{ color: documentStyle.secondaryColor }}>
                              {item.quantity}
                            </td>
                            <td className="text-right py-2" style={{ color: documentStyle.secondaryColor }}>
                              {item.days}
                            </td>
                            <td className="text-right py-2" style={{ color: documentStyle.secondaryColor }}>
                              ${item.rate.toFixed(2)}
                            </td>
                            <td className="text-right py-2" style={{ color: documentStyle.secondaryColor }}>
                              ${item.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t pt-4">
                    <div
                      className="flex justify-between font-bold text-lg"
                      style={{ color: documentStyle.primaryColor }}
                    >
                      <span>Total Estimated Cost:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {additionalNotes && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2" style={{ color: documentStyle.primaryColor }}>
                        Additional Notes:
                      </h4>
                      <p className="text-sm" style={{ color: documentStyle.secondaryColor }}>
                        {additionalNotes}
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-600" style={{ color: documentStyle.secondaryColor }}>
                      {terms}
                    </p>
                  </div>

                  {signature && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold" style={{ color: documentStyle.primaryColor }}>
                        Authorized by:
                      </p>
                      <img src={signature || "/placeholder.svg"} alt="Signature" className="h-16 mt-2" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Secure PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
// Note: The PDF generation functionality is not implemented in this snippet.
// You can use libraries like jsPDF or html2canvas to implement PDF generation based on the preview.