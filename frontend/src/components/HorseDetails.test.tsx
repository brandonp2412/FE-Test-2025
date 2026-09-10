import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HorseDetails from './HorseDetails';

const horse = (id: string, name: string) => ({
  id,
  name,
  profile: {
    favouriteFood: 'Grass',
    physical: { height: 160, weight: 350 },
  },
});

describe('HorseDetails request lifecycle', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('clears a previous request error when a different horse is selected', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({ ok: false, status: 500 } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => horse('2', 'Spirit'),
      } as Response);

    const { rerender } = render(<HorseDetails horseId="1" />);
    await screen.findByText(/HTTP error! status: 500/i);

    rerender(<HorseDetails horseId="2" />);

    expect(screen.queryByText(/HTTP error! status: 500/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Loading horse details/i)).toBeInTheDocument();
    await screen.findByText('Spirit');
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  test('aborts the stale request when horseId changes', async () => {
    let firstSignal: AbortSignal | undefined;
    const firstRequest = new Promise<Response>((_resolve, reject) => {
      jest.spyOn(global, 'fetch').mockImplementationOnce((_input, init) => {
        firstSignal = init?.signal || undefined;
        firstSignal?.addEventListener('abort', () => {
          const error = new Error('aborted');
          error.name = 'AbortError';
          reject(error);
        });
        return firstRequest;
      }).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => horse('2', 'Spirit'),
      } as Response);
    });

    const { rerender } = render(<HorseDetails horseId="1" />);
    await waitFor(() => expect(firstSignal).toBeDefined());

    rerender(<HorseDetails horseId="2" />);

    await waitFor(() => expect(firstSignal?.aborted).toBe(true));
    await screen.findByText('Spirit');
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();
  });
});
