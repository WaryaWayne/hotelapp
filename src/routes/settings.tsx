import SettingsPanel from '@/components/ui/custom/settings-panel'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsPanel,
})

