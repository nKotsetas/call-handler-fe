# Call Handler

A React + TypeScript front end for browsing call activity: see the call feed, open a call's details and notes, and archive calls. Data comes from the [Call Center API](https://call-center-mu.vercel.app/docs).

## Features

- **Call feed:** direction, from/to numbers, call type and date for every active call (`GET /calls`)
- **Call details:** clicking a call opens a panel with full details and notes (`GET /calls/:callId`), with a "not found" message for 404s
- **Archive:** archives on the server (`PATCH /calls/:callId/archive`) with an **optimistic update**. The call disappears immediately and comes back with an error message if the request fails.
- Loading, error and empty states for every request, plus **Try again** when the feed fails to load
- Light and dark mode (follows the system setting), keyboard-accessible rows, responsive layout

## Getting started

Requires [Bun](https://bun.sh) (or Node 20+ with npm).

```bash
bun install
bun run dev
```

Open http://localhost:5173.

### Environment variables

Defaults are in `.env`. To override them locally, create `.env.local`, which is gitignored.

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | API base URL |
| `VITE_USER_ID` | Sent as the `X-User-Id` header. Each id gets its own isolated copy of the data |

> `VITE_` variables are bundled into the client code, so never put secrets in them.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the dev server |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Serve the production build locally |
| `bun run lint` | Run ESLint |

## Project structure

```
src/
  components/   UI components (CallList, CallItem, CallDetails, StatusMessage)
  hooks/        custom hooks (data fetching for components)
  services/     callService.ts — the only place that talks to the API
  store/        Redux Toolkit store, typed hooks and the calls slice
  types/        shared TypeScript types
  utils/        formatting and error helpers
```

## Technical decisions

- **Service layer:** components never call `fetch`. `callService.ts` adds the `X-User-Id` header once and turns non-2xx responses into a typed `ApiError`, because `fetch` doesn't reject on 404 or 500.
- **Redux Toolkit for the feed:** the call list is shared state changed by several actions (load, archive, rollback), so it lives in a slice with `createAsyncThunk`. The selected call and the details panel data only matter to one component, so they stay in local state.
- **Async state as discriminated unions** (`loading | error | success`) instead of separate booleans, so impossible states such as "loading and error at the same time" can't happen and TypeScript narrows each branch.
- **Request cancellation:** every effect aborts its request in cleanup (`AbortController`, or `thunk.abort()`). This prevents race conditions when clicking between calls quickly, and is why React StrictMode shows one cancelled request in development.
- **`key={selectedCallId}`** on the details panel resets its state when another call is selected, instead of resetting it in an effect.

## Known limitations

- The API has no unarchive endpoint, so archiving can't be undone.
