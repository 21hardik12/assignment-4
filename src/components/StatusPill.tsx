import type { PermissionState } from '../types/hardware'

interface StatusPillProps {
  label: string
  state: PermissionState
}

const stateLabelMap: Record<PermissionState, string> = {
  idle: 'Idle',
  pending: 'Awaiting Permission',
  granted: 'Granted',
  denied: 'Denied',
  error: 'Error',
  unsupported: 'Unsupported',
}

export const StatusPill = ({ label, state }: StatusPillProps) => {
  return (
    <div className={`status-pill status-pill--${state}`}>
      <span className="status-pill__label">{label}</span>
      <strong className="status-pill__value">{stateLabelMap[state]}</strong>
    </div>
  )
}
