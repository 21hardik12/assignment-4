export type PermissionState =
  | 'idle'
  | 'pending'
  | 'granted'
  | 'denied'
  | 'error'
  | 'unsupported'

export type FeatureStatus = 'idle' | 'active' | 'error' | 'unsupported'

export interface FeatureError {
  code: string
  message: string
}

export interface CameraState {
  permission: PermissionState
  status: FeatureStatus
  stream: MediaStream | null
  error: FeatureError | null
}

export interface SpeechState {
  permission: PermissionState
  status: FeatureStatus
  isListening: boolean
  transcript: string
  interimTranscript: string
  error: FeatureError | null
}

export interface BluetoothState {
  permission: PermissionState
  status: FeatureStatus
  deviceName: string | null
  deviceId: string | null
  error: FeatureError | null
}
