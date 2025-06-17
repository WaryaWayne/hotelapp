"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Save, Building } from "lucide-react"

interface SettingsPanelProps {
  onClose: () => void
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [hotelInfo, setHotelInfo] = useState({
    name: "Grand Hotel",
    address: "123 Hotel Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "billing@grandhotel.com",
    website: "www.grandhotel.com",
    taxId: "TAX123456789",
  })

  const [preferences, setPreferences] = useState({
    defaultTaxRate: 10,
    defaultCurrency: "USD",
    autoSaveInterval: 2000,
    defaultTemplate: "modern",
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedHotelInfo = localStorage.getItem("hotelInfo")
    const savedPreferences = localStorage.getItem("userPreferences")

    if (savedHotelInfo) {
      setHotelInfo(JSON.parse(savedHotelInfo))
    }

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem("hotelInfo", JSON.stringify(hotelInfo))
    localStorage.setItem("userPreferences", JSON.stringify(preferences))

    // Show success message
    alert("Settings saved successfully!")
    onClose()
  }

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      localStorage.removeItem("hotelInfo")
      localStorage.removeItem("userPreferences")
      localStorage.removeItem("invoiceData")
      localStorage.removeItem("quotationData")
      localStorage.removeItem("receiptBuilderData")

      setHotelInfo({
        name: "Grand Hotel",
        address: "123 Hotel Street, City, State 12345",
        phone: "+1 (555) 123-4567",
        email: "billing@grandhotel.com",
        website: "www.grandhotel.com",
        taxId: "TAX123456789",
      })

      setPreferences({
        defaultTaxRate: 10,
        defaultCurrency: "USD",
        autoSaveInterval: 2000,
        defaultTemplate: "modern",
      })

      alert("Settings reset successfully!")
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-500 via-sky-500 to-yellow-500 bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Settings
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[60vh] space-y-6">
          {/* Hotel Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hotel Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hotelName">Hotel Name</Label>
                <Input
                  id="hotelName"
                  value={hotelInfo.name}
                  onChange={(e) => setHotelInfo({ ...hotelInfo, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hotelPhone">Phone</Label>
                <Input
                  id="hotelPhone"
                  value={hotelInfo.phone}
                  onChange={(e) => setHotelInfo({ ...hotelInfo, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hotelEmail">Email</Label>
                <Input
                  id="hotelEmail"
                  type="email"
                  value={hotelInfo.email}
                  onChange={(e) => setHotelInfo({ ...hotelInfo, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hotelWebsite">Website</Label>
                <Input
                  id="hotelWebsite"
                  value={hotelInfo.website}
                  onChange={(e) => setHotelInfo({ ...hotelInfo, website: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={hotelInfo.taxId}
                  onChange={(e) => setHotelInfo({ ...hotelInfo, taxId: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="hotelAddress">Address</Label>
              <Textarea
                id="hotelAddress"
                value={hotelInfo.address}
                onChange={(e) => setHotelInfo({ ...hotelInfo, address: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                <Input
                  id="defaultTaxRate"
                  type="number"
                  value={preferences.defaultTaxRate}
                  onChange={(e) =>
                    setPreferences({ ...preferences, defaultTaxRate: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <select
                  id="defaultCurrency"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={preferences.defaultCurrency}
                  onChange={(e) => setPreferences({ ...preferences, defaultCurrency: e.target.value })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="autoSaveInterval">Auto-save Interval (ms)</Label>
                <Input
                  id="autoSaveInterval"
                  type="number"
                  value={preferences.autoSaveInterval}
                  onChange={(e) =>
                    setPreferences({ ...preferences, autoSaveInterval: Number.parseInt(e.target.value) || 2000 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="defaultTemplate">Default Template</Label>
                <select
                  id="defaultTemplate"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={preferences.defaultTemplate}
                  onChange={(e) => setPreferences({ ...preferences, defaultTemplate: e.target.value })}
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="elegant">Elegant</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={resetSettings}>
              Reset to Default
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={saveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
