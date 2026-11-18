import type { Call, CallDetail } from '../types/call'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `Request failed with status ${response.status}`
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
      return body.error
    }
    return fallback
  } catch {
    return fallback
  }
}

async function request<T>(userId: string, path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('X-User-Id', userId)

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response))
  }

  return (await response.json()) as T
}

export async function getCalls(userId: string, signal?: AbortSignal): Promise<Call[]> {
  const data = await request<{ calls: Call[] }>(userId, '/calls', { signal })
  return data.calls
}

export function getCall(userId: string, callId: string, signal?: AbortSignal): Promise<CallDetail> {
  return request<CallDetail>(userId, `/calls/${encodeURIComponent(callId)}`, { signal })
}

export function archiveCall(userId: string, callId: string, signal?: AbortSignal): Promise<Call> {
  return request<Call>(userId, `/calls/${encodeURIComponent(callId)}/archive`, {
    method: 'PATCH',
    signal,
  })
}
