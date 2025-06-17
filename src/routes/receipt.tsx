import ReceiptBuilder from '@/components/ui/custom/receipt-builder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/receipt')({
  component: ReceiptBuilder,
})
