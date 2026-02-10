export const appEvents = new EventTarget()

export function emitGoalsChanged() {
  appEvents.dispatchEvent(new Event('goals:changed'))
}
