import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: HotelManagementSystem,
})

function RouteComponent() {
  return <div>Hello "/dashboard"!</div>
}

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Receipt, Calculator, Settings, History } from "lucide-react"
import FloatingCalculator from "@/components/ui/custom/FloatingCalculator"
import InvoiceGenerator from "@/components/ui/custom/InvoiceGenerator"
import QuotationCreator from "@/components/ui/custom/quotation-creator"
import ReceiptBuilder from "@/components/ui/custom/receipt-builder"
import RecentDocuments from "@/components/ui/custom/recent-documents"
import SettingsPanel from "@/components/ui/custom/settings-panel"

export default function HotelManagementSystem() {
  const [activeModule, setActiveModule] = useState<string>("dashboard")
  const [showCalculator, setShowCalculator] = useState(false)
  const [showRecentDocuments, setShowRecentDocuments] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const modules = [
    {
      id: "invoice",
      title: "Invoice Generator",
      description: "Create professional invoices for your hotel services",
      icon: FileText,
      color: "bg-blue-500",
      route: "/invoice",
    },
    {
      id: "quotation",
      title: "Quotation Creator",
      description: "Generate detailed quotations for potential clients",
      icon: Receipt,
      color: "bg-green-500",
      route: "/quote",
    },
    {
      id: "receipt",
      title: "Receipt Builder",
      description: "Create receipts for completed transactions",
      icon: Receipt,
      color: "bg-purple-500",
      route: "/receipt",
    },
  ]

  const renderActiveModule = () => {
    switch (activeModule) {
      case "invoice":
        return <InvoiceGenerator onClose={() => setActiveModule("dashboard")} />
      case "quotation":
        return <QuotationCreator onBack={() => setActiveModule("dashboard")} />
      case "receipt":
        return <ReceiptBuilder onBack={() => setActiveModule("dashboard")} />
      default:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">Hotel Management System</h1>
              <p className="text-xl text-gray-600">
                Streamline your hotel operations with automated invoicing and documentation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modules.map((module) => {
                const IconComponent = module.icon
                return (
                  <Card
                    key={module.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setActiveModule(module.id)}
                  >
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 ${module.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" onClick={() => setActiveModule(module.id)}>
                        Open {module.title}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button variant="outline" onClick={() => setShowCalculator(true)} className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Open Calculator
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRecentDocuments(true)}
                  className="flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  View Recent Documents
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(true)} className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {renderActiveModule()}

        {/* Floating Calculator */}
        {showCalculator && <FloatingCalculator onClose={() => setShowCalculator(false)} />}

        {/* Recent Documents Modal */}
        {showRecentDocuments && <RecentDocuments onClose={() => setShowRecentDocuments(false)} />}

        {/* Settings Modal */}
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

        {/* Global Calculator Button */}
        {activeModule !== "dashboard" && (
          <Button
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
            onClick={() => setShowCalculator(true)}
          >
            <Calculator className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  )
}
