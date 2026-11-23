import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockConnectionState = vi.fn().mockReturnValue('disconnected');
const mockConnectionError = vi.fn().mockReturnValue(false);

interface RealtimeStateForIndicator {
  connectionState: 'connected' | 'disconnected' | 'reconnecting';
  connectionError: boolean;
}

vi.mock('@/src/features/claims/stores/use-realtime-store', () => ({
  useRealtimeStore: (selector: (state: RealtimeStateForIndicator) => unknown) => {
    const state = {
      connectionState: mockConnectionState(),
      connectionError: mockConnectionError(),
    };
    return selector(state);
  },
}));

import { ConnectionStatusIndicator } from './connection-status-indicator';

describe('ConnectionStatusIndicator', () => {
  beforeEach(() => {
    mockConnectionState.mockReturnValue('disconnected');
    mockConnectionError.mockReturnValue(false);
  });

  it('shows "Offline" when disconnected', () => {
    render(<ConnectionStatusIndicator />);
    expect(screen.getByRole('status')).toHaveTextContent('Offline');
  });

  it('shows "Live" when connected', () => {
    mockConnectionState.mockReturnValue('connected');
    render(<ConnectionStatusIndicator />);
    expect(screen.getByRole('status')).toHaveTextContent('Live');
  });

  it('shows "Reconnecting..." when reconnecting', () => {
    mockConnectionState.mockReturnValue('reconnecting');
    render(<ConnectionStatusIndicator />);
    expect(screen.getByRole('status')).toHaveTextContent('Reconnecting...');
  });

  it('shows "Offline" with error message when connection error exists', () => {
    mockConnectionError.mockReturnValue(true);
    render(<ConnectionStatusIndicator />);
    expect(screen.getByRole('status')).toHaveTextContent('Offline');
    expect(screen.getByRole('status')).toHaveAttribute(
      'title',
      'Real-time updates unavailable. Max reconnection attempts reached.'
    );
  });
});
