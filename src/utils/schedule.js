function addRepeatInterval(from, repeatEvery, repeatUnit) {
  const next = new Date(from);
  if (repeatUnit === 'week') {
    next.setDate(next.getDate() + repeatEvery * 7);
    return next;
  }
  if (repeatUnit === 'month') {
    next.setMonth(next.getMonth() + repeatEvery);
    return next;
  }
  next.setDate(next.getDate() + repeatEvery);
  return next;
}

function toMinute(date) {
  return Math.floor(date.getTime() / 60_000);
}

export function getNextOccurrence(schedule, from = new Date()) {
  const start = new Date(schedule?.startTime || schedule?.nextRunAt);
  if (Number.isNaN(start.getTime())) return from;

  const unit = schedule.repeatUnit || 'day';
  const every = Math.max(1, Number(schedule.repeatEvery || schedule.frequencyDays || 1));
  let cursor = new Date(start);
  let guard = 0;
  while (toMinute(cursor) < toMinute(from) && guard < 400) {
    cursor = addRepeatInterval(cursor, every, unit);
    guard += 1;
  }
  return cursor;
}

function occurrenceKey(date) {
  return date.toISOString().slice(0, 16);
}

function listOccurrences(schedule, horizonMonths = 24) {
  const start = new Date(schedule.startTime);
  const keys = new Set();
  if (Number.isNaN(start.getTime())) return keys;

  const unit = schedule.repeatUnit || 'day';
  const every = Math.max(1, Number(schedule.repeatEvery || schedule.frequencyDays || 1));
  const limit = new Date(start);
  limit.setMonth(limit.getMonth() + horizonMonths);

  let cursor = new Date(start);
  let guard = 0;
  while (cursor <= limit && guard < 400) {
    keys.add(occurrenceKey(cursor));
    cursor = addRepeatInterval(cursor, every, unit);
    guard += 1;
  }
  return keys;
}

export function findOverlappingSchedule(candidate, schedules = []) {
  const candidateKeys = listOccurrences(candidate);
  return schedules.find((schedule) => {
    if (candidate.scheduleId && schedule.scheduleId === candidate.scheduleId) return false;
    const otherKeys = listOccurrences(schedule);
    for (const key of candidateKeys) {
      if (otherKeys.has(key)) return true;
    }
    return false;
  });
}
