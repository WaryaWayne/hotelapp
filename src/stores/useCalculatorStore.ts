// stores/useCalculatorStore.ts
import { create } from 'zustand'

type Position = {
  x: number
  y: number
}

type Offset = {
  x: number
  y: number
}

type CalculatorStore = {
  display: string
  setDisplay: (value: string) => void

  previousValue: number | null
  setPreviousValue: (value: number | null) => void

  operation: string | null
  setOperation: (value: string | null) => void

  waitingForOperand: boolean
  setWaitingForOperand: (value: boolean) => void

  isMinimized: boolean
  setIsMinimized: (value: boolean) => void

  position: Position
  setPosition: (value: Position) => void

  isDragging: boolean
  setIsDragging: (value: boolean) => void

  dragOffset: Offset
  setDragOffset: (value: Offset) => void
}

export const useCalculatorStore = create<CalculatorStore>((set) => ({
  display: '0',
  setDisplay: (value) => set({ display: value }),

  previousValue: null,
  setPreviousValue: (value) => set({ previousValue: value }),

  operation: null,
  setOperation: (value) => set({ operation: value }),

  waitingForOperand: false,
  setWaitingForOperand: (value) => set({ waitingForOperand: value }),

  isMinimized: false,
  setIsMinimized: (value) => set({ isMinimized: value }),

  position: { x: 24, y: 24 },
  setPosition: (value) => set({ position: value }),

  isDragging: false,
  setIsDragging: (value) => set({ isDragging: value }),

  dragOffset: { x: 0, y: 0 },
  setDragOffset: (value) => set({ dragOffset: value }),
}))
