import test from 'node:test';
import assert from 'node:assert/strict';
import { upsertMessage } from './messageUtils.js';

test('upsertMessage prevents the same message from being added twice', () => {
  const message = {
    _id: 'm-1',
    conversation: 'c-1',
    content: 'hello',
    createdAt: '2026-01-01T00:00:00.000Z',
    sender: { _id: 'u-1', name: 'Alice' }
  };

  const merged = upsertMessage([message], message);
  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0], message);
});

test('upsertMessage appends a new message when it is different', () => {
  const existing = {
    _id: 'm-1',
    conversation: 'c-1',
    content: 'hello',
    createdAt: '2026-01-01T00:00:00.000Z',
    sender: { _id: 'u-1', name: 'Alice' }
  };

  const next = {
    _id: 'm-2',
    conversation: 'c-1',
    content: 'world',
    createdAt: '2026-01-01T00:00:01.000Z',
    sender: { _id: 'u-2', name: 'Bob' }
  };

  const merged = upsertMessage([existing], next);
  assert.equal(merged.length, 2);
  assert.deepEqual(merged[1], next);
});
