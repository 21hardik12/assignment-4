import { useCallback, useEffect, useMemo, useState } from 'react'
import { toFeatureError } from '../lib/errors'
import type { CameraState } from '../types/hardware'

const initialState: CameraState = {
  permission: 'idle',
  status: 'idle',
  stream: null,
  error: null,
}

const getUnsupportedState = (): CameraState => ({
  ...initialState,
  permission: 'unsupported',
  status: 'unsupported',
  error: {
    code: 'unsupported',
    message: 'Camera access is not supported in this browser.',
  },
})

const getNoCameraState = (): CameraState => ({
  ...initialState,
  permission: 'error',
  status: 'error',
  error: {
    code: 'device_not_found',
    message: 'No camera device was detected on this system.',
  },
})

export const useCamera = () => {
  const isSupported = useMemo(
    () => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
    [],
  )

  const [state, setState] = useState<CameraState>(() =>
    isSupported ? initialState : getUnsupportedState(),
  )

  const stopCamera = useCallback(() => {
    setState((current) => {
      current.stream?.getTracks().forEach((track) => track.stop())

      return {
        ...current,
        stream: null,
        status: current.permission === 'granted' ? 'idle' : current.status,
      }
    })
  }, [])

  const startCamera = useCallback(async () => {
    if (!isSupported) {
      return
    }

    setState((current) => ({
      ...current,
      permission: 'pending',
      status: 'idle',
      error: null,
    }))

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasVideoInput = devices.some((device) => device.kind === 'videoinput')

      if (!hasVideoInput) {
        if (typeof window !== 'undefined') {
          window.alert('No camera detected on this device. Please connect a camera and try again.')
        }
        setState(getNoCameraState())
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      })

      setState({
        permission: 'granted',
        status: 'active',
        stream,
        error: null,
      })
    } catch (error) {
      const featureError = toFeatureError(error)

      if (featureError.code === 'device_not_found' && typeof window !== 'undefined') {
        window.alert('No camera detected on this device. Please connect a camera and try again.')
      }

      setState({
        ...initialState,
        permission: featureError.code === 'permission_denied' ? 'denied' : 'error',
        status: 'error',
        error: featureError,
      })
    }
  }, [isSupported])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return {
    ...state,
    isSupported,
    startCamera,
    stopCamera,
  }
}
