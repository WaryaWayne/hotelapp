"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Minus, Move, CalculatorIcon, Percent, Delete, Divide, Plus, MinusIcon } from "lucide-react"

interface FloatingCalculatorProps {
  onClose: () => void
}

export default function FloatingCalculator({ onClose }: FloatingCalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Dragging state
  const [position, setPosition] = useState({ x: 24, y: 24 }) // Initial position (left: 24px, bottom: 24px from viewport)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const calculatorRef = useRef<HTMLDivElement>(null)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "%":
        return (firstValue * secondValue) / 100
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const calculatePercentage = () => {
    const currentValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      // Calculate percentage based on the operation
      let result

      switch (operation) {
        case "+":
          // Add percentage of first number to first number
          result = previousValue + (previousValue * currentValue) / 100
          break
        case "-":
          // Subtract percentage of first number from first number
          result = previousValue - (previousValue * currentValue) / 100
          break
        case "×":
          // Calculate percentage of first number
          result = previousValue * (currentValue / 100)
          break
        case "÷":
          // Calculate first number divided by percentage
          result = previousValue / (currentValue / 100)
          break
        default:
          // Just convert to percentage
          result = currentValue / 100
      }

      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    } else {
      // Just convert to percentage if no operation
      const percentValue = currentValue / 100
      setDisplay(String(percentValue))
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay("0")
    }
  }

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!calculatorRef.current) return

    const rect = calculatorRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    // Keep calculator within viewport bounds
    const maxX = window.innerWidth - (isMinimized ? 60 : 320) // Adjust width based on state
    const maxY = window.innerHeight - (isMinimized ? 60 : 400) // Adjust height based on state

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add global mouse event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = "none" // Prevent text selection while dragging
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = ""
    }
  }, [isDragging, dragOffset, isMinimized])

  if (isMinimized) {
    return (
      <div className="fixed z-50" style={{ left: position.x, top: position.y }} ref={calculatorRef}>
        <div
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-14 h-14 shadow-lg flex items-center justify-center cursor-move relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-full transition-all duration-200"></div>
          <CalculatorIcon className="w-7 h-7 text-white" />

          <div className="absolute -top-1 -right-1">
            <Button
              variant="secondary"
              size="icon"
              className="h-5 w-5 rounded-full bg-white hover:bg-gray-200 shadow-sm"
              onClick={() => setIsMinimized(false)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed z-50 w-80" style={{ left: position.x, top: position.y }} ref={calculatorRef}>
      <Card className="shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-move select-none bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          onMouseDown={handleMouseDown}
        >
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Move className="h-4 w-4 text-white opacity-70" />
            Calculator
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0 hover:bg-white/20 text-white"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-white/20 text-white">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner text-right text-3xl font-mono border border-gray-200 dark:border-gray-700 h-16 flex items-center justify-end overflow-hidden">
            <div className="truncate">{display}</div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              onClick={clear}
              className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            >
              C
            </Button>
            <Button
              variant="outline"
              onClick={backspace}
              className="bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200"
            >
              <Delete className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={calculatePercentage}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            >
              <Percent className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => inputOperation("÷")}
              className="bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
            >
              <Divide className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => inputNumber("7")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              7
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber("8")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              8
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber("9")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              9
            </Button>
            <Button
              variant="outline"
              onClick={() => inputOperation("×")}
              className="bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
            >
              ×
            </Button>

            <Button
              variant="outline"
              onClick={() => inputNumber("4")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              4
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber("5")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              5
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber("6")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              6
            </Button>
            <Button
              variant="outline"
              onClick={() => inputOperation("-")}
              className="bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
            >
              <MinusIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => inputNumber("1")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              1
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber("2")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              2
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber("3")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              3
            </Button>
            <Button
              variant="outline"
              onClick={() => inputOperation("+")}
              className="bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200 row-span-2"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => inputNumber("0")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium col-span-2"
            >
              0
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber(".")}
              className="bg-gray-50 hover:bg-gray-100 border-gray-200 font-medium"
            >
              .
            </Button>

            <Button
              onClick={performCalculation}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              =
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
