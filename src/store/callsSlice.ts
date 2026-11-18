import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { archiveCall as archiveCallRequest, getCalls } from '../services/callService'
import type { Call } from '../types/call'
import { getErrorMessage } from '../utils/errors'
import type { RootState } from './store'

interface PendingArchive {
  call: Call
  index: number
}

interface CallsState {
  items: Call[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  pendingArchives: Record<string, PendingArchive>
  archiveError: string | null
}

const initialState: CallsState = {
  items: [],
  status: 'idle',
  error: null,
  pendingArchives: {},
  archiveError: null,
}

export const fetchCalls = createAsyncThunk<Call[], string, { rejectValue: string }>(
  'calls/fetchCalls',
  async (userId, { signal, rejectWithValue }) => {
    try {
      return await getCalls(userId, signal)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

interface ArchiveCallArgs {
  userId: string
  callId: string
}

export const archiveCall = createAsyncThunk<Call, ArchiveCallArgs, { rejectValue: string }>(
  'calls/archiveCall',
  async ({ userId, callId }, { signal, rejectWithValue }) => {
    try {
      return await archiveCallRequest(userId, callId, signal)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    archiveErrorDismissed(state) {
      state.archiveError = null
    },
    /** Clears everything from the previous session, e.g. on logout. */
    callsReset() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalls.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCalls.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCalls.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.status = 'failed'
        state.error = action.payload ?? 'Could not load calls.'
      })
      .addCase(archiveCall.pending, (state, action) => {
        const { callId } = action.meta.arg
        const index = state.items.findIndex((call) => call.id === callId)
        if (index === -1) return
        state.pendingArchives[callId] = { call: state.items[index], index }
        state.items.splice(index, 1)
        state.archiveError = null
      })
      .addCase(archiveCall.fulfilled, (state, action) => {
        delete state.pendingArchives[action.meta.arg.callId]
      })
      .addCase(archiveCall.rejected, (state, action) => {
        // Aborted on logout: the state was already reset, so there is nothing to roll back.
        if (action.meta.aborted) return
        const { callId } = action.meta.arg
        const pending = state.pendingArchives[callId]
        if (pending) {
          state.items.splice(Math.min(pending.index, state.items.length), 0, pending.call)
          delete state.pendingArchives[callId]
        }
        state.archiveError = action.payload ?? 'Could not archive the call.'
      })
  },
})

export const { archiveErrorDismissed, callsReset } = callsSlice.actions
export const callsReducer = callsSlice.reducer

export const selectCalls = (state: RootState) => state.calls.items
export const selectCallsStatus = (state: RootState) => state.calls.status
export const selectCallsError = (state: RootState) => state.calls.error
export const selectArchiveError = (state: RootState) => state.calls.archiveError
