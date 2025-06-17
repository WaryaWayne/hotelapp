import InvoiceGenerator from '@/components/ui/custom/InvoiceGenerator'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/invoice')({
  component: InvoiceGenerator,
})