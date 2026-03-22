import { useEffect, useRef } from 'react'
import { Panel } from './Panel'
import { StatusPill } from './StatusPill'
import type { useCamera } from '../hooks/useCamera'

interface CameraPanelProps {
  camera: ReturnType<typeof useCamera>
}

export const CameraPanel = ({ camera }: CameraPanelProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) {
      return
    }

    videoRef.current.srcObject = camera.stream
  }, [camera.stream])

  return (
    <Panel
      title="Optical Channel"
      subtitle="Live camera stream via WebRTC getUserMedia"
      actions={
        <>
          <button onClick={camera.startCamera} disabled={!camera.isSupported || camera.permission === 'pending'}>
            Start Camera
          </button>
          <button onClick={camera.stopCamera} disabled={!camera.stream} className="btn-ghost">
            Stop
          </button>
        </>
      }
      footer={
        <div className="panel__meta">
          <StatusPill label="Camera Permission" state={camera.permission} />
          {camera.error ? <p className="error-text">{camera.error.message}</p> : null}
        </div>
      }
    >
      <div className="camera-frame">
        {camera.stream ? (
          <video ref={videoRef} autoPlay muted playsInline aria-label="Live camera feed" />
        ) : (
          <div className="empty-state">
            <p>Camera feed offline.</p>
            <small>Start the camera to initialize the optical channel.</small>
          </div>
        )}
      </div>
    </Panel>
  )
}
