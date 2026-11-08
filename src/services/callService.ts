import type { Call, CallDetail } from '../types/call'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const USER_ID = import.meta.env.VITE_USER_ID

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

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('X-User-Id', USER_ID)

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response))
  }

  return (await response.json()) as T
}

export async function getCalls(signal?: AbortSignal): Promise<Call[]> {
  const data = await request<{ calls: Call[] }>('/calls', { signal })
  return data.calls
}

export function getCall(callId: string, signal?: AbortSignal): Promise<CallDetail> {
  return request<CallDetail>(`/calls/${encodeURIComponent(callId)}`, { signal })
}

export function archiveCall(callId: string): Promise<Call> {
  return request<Call>(`/calls/${encodeURIComponent(callId)}/archive`, { method: 'PATCH' })
}
