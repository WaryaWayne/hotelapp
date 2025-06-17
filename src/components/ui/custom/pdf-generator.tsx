"use client"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface PDFGeneratorProps {
  elementId: string
  filename: string
  onComplete?: () => void
}

export const generateSecurePDF = async ({ elementId, filename, onComplete }: PDFGeneratorProps) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error("Element not found")
    }

    // Convert HTML to canvas (image)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    })

    // Create PDF from the canvas image
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Add watermark for security
    pdf.setFontSize(50)
    pdf.setTextColor(200, 200, 200)
    pdf.text("ORIGINAL DOCUMENT", 105, 150, {
      angle: 45,
      align: "center",
    })

    // Save the PDF
    pdf.save(filename)

    if (onComplete) {
      onComplete()
    }

    return true
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Error generating PDF. Please try again.")
    return false
  }
}
