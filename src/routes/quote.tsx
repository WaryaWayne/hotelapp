import QuotationCreator from '@/components/ui/custom/quotation-creator'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/quote')({
  component: QuotationCreator,
})
