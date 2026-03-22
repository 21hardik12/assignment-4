import { Panel } from './Panel'
import { StatusPill } from './StatusPill'
import type { useBluetooth } from '../hooks/useBluetooth'

interface BluetoothPanelProps {
  bluetooth: ReturnType<typeof useBluetooth>
}

export const BluetoothPanel = ({ bluetooth }: BluetoothPanelProps) => {
  return (
    <Panel
      title="Bluetooth Link"
      subtitle="Secure nearby device scan via Web Bluetooth"
      actions={
        <button
          onClick={bluetooth.requestDevice}
          disabled={!bluetooth.isSupported || bluetooth.permission === 'pending'}
        >
          Scan Nearby Devices
        </button>
      }
      footer={
        <div className="panel__meta">
          <StatusPill label="Bluetooth Permission" state={bluetooth.permission} />
          {bluetooth.error ? <p className="error-text">{bluetooth.error.message}</p> : null}
        </div>
      }
    >
      {bluetooth.deviceName ? (
        <dl className="device-card">
          <div>
            <dt>Device Name</dt>
            <dd>{bluetooth.deviceName}</dd>
          </div>
          <div>
            <dt>Device ID</dt>
            <dd>{bluetooth.deviceId}</dd>
          </div>
        </dl>
      ) : (
        <div className="empty-state">
          <p>No Bluetooth device selected.</p>
          <small>Run a scan and choose a nearby device to establish a link.</small>
        </div>
      )}
    </Panel>
  )
}
