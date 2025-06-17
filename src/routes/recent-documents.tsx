import RecentDocuments from '@/components/ui/custom/recent-documents'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recent-documents')({
  component: RecentDocuments,
})
