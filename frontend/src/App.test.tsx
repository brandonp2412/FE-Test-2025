import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { Horse } from './types/Horse';

// Declare mockHorses in a scope accessible by tests
let mockHorses: Horse[];
let fetchSpy: jest.SpyInstance;

beforeEach(() => {
  mockHorses = [
      { id: '1', name: 'Thunderdash', profile: { favouriteFood: 'Carrots', physical: { height: 180, weight: 450 } } },
      { id: '2', name: 'Spirit', profile: { favouriteFood: 'Apples', physical: { height: 160, weight: 350 } } },
      { id: '3', name: 'Black Beauty', profile: { favouriteFood: 'Sugar Cubes', physical: { height: 170, weight: 410 } } },
    ];
  
  // Clear any existing mock for fetch
  if (fetchSpy) {
    fetchSpy.mockRestore();
  }

  // Spy on global fetch and provide a custom implementation
  fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
    // Determine the URL string correctly
    const requestUrl = input instanceof Request ? input.url : input.toString();
    const method = init?.method || 'GET'; // Default to GET if method is not specified

    if (requestUrl.endsWith('/horse') && method === 'GET') {
      return Promise.resolve(new Response(JSON.stringify(mockHorses), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (requestUrl.match(/\/horse\/(\w|-)+$/) && method === 'GET') {
      const id = requestUrl.split('/').pop();
      const horse = mockHorses.find(h => h.id === id);
      return Promise.resolve(new Response(JSON.stringify(horse), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (requestUrl.endsWith('/horse') && method === 'PUT') {
        // Simulate adding a new horse
        const newHorse = JSON.parse(init?.body as string);
        newHorse.id = `new-horse-id-${mockHorses.length + 1}`; // Assign a new ID
        mockHorses.push(newHorse);
        return Promise.resolve(new Response(JSON.stringify({ id: newHorse.id }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (requestUrl.match(/\/horse\/(\w|-)+$/) && method === 'PUT') { // Removed invalid ~
        // Simulate updating an existing horse
        const id = requestUrl.split('/').pop();
        const updatedHorse = JSON.parse(init?.body as string);
        const index = mockHorses.findIndex(h => h.id === id);
        if (index !== -1) {
            // Update the mockHorses array in place
            mockHorses[index] = { ...mockHorses[index], ...updatedHorse, id: id as string };
            return Promise.resolve(new Response(JSON.stringify(mockHorses[index]), { status: 200, headers: { 'Content-Type': 'application/json' } }));
        }
        return Promise.resolve(new Response(JSON.stringify(null), { status: 404, headers: { 'Content-Type': 'application/json' } }));
    }
    return Promise.reject(new Error('unhandled fetch'));
  });
});

afterEach(() => {
  fetchSpy.mockRestore(); // Restore original fetch after each test
});


describe('App Component User Flows', () => {
  test('should display loading state, then horse list', async () => {
    render(<App />);
    expect(screen.getByText(/loading horses/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/Thunderdash/i)).toBeInTheDocument());
    expect(screen.getByText(/Spirit/i)).toBeInTheDocument();
    expect(screen.getByText(/Black Beauty/i)).toBeInTheDocument();
  });

  test('should display horse details when a horse name is clicked', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/Thunderdash/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText(/Thunderdash/i));
    await waitFor(() => expect(screen.getByText(/Favourite Food: Carrots/i)).toBeInTheDocument());
    expect(screen.getByText(/Classification: Horse/i)).toBeInTheDocument(); // 450kg >= 400kg
  });

  test('should allow adding a new horse', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/Thunderdash/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /add new horse/i }));
    await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument()); // Use exact label text

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Horse' } });
    fireEvent.change(screen.getByLabelText('Favourite Food'), { target: { value: 'Grass' } });
    fireEvent.change(screen.getByLabelText('Height (cm)'), { target: { value: '150' } });
    fireEvent.change(screen.getByLabelText('Weight (kg)'), { target: { value: '300' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(screen.getByText(/New Horse/i)).toBeInTheDocument());
  });

  test('should allow editing an existing horse', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/Thunderdash/i)).toBeInTheDocument());

    // Click on Thunderdash to view details
    fireEvent.click(screen.getByText(/Thunderdash/i));
    await waitFor(() => expect(screen.getByText(/Favourite Food: Carrots/i)).toBeInTheDocument());

    // Click Edit Horse button
    fireEvent.click(screen.getByRole('button', { name: /edit horse/i }));
    await waitFor(() => expect(screen.getByLabelText('Name')).toHaveValue('Thunderdash'));

    // Change Favourite Food
    fireEvent.change(screen.getByLabelText('Favourite Food'), { target: { value: 'Hay' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // After saving, the list should re-render. Click on Thunderdash again to see updated details.
    await waitFor(() => expect(screen.getByText(/Thunderdash/i)).toBeInTheDocument()); // Ensure list is visible
    fireEvent.click(screen.getByText(/Thunderdash/i)); // Click again to re-load details

    // Now, assert that the details view shows the new favourite food
    await waitFor(() => expect(screen.getByText(/Favourite Food: Hay/i)).toBeInTheDocument());
  });

  test('should allow comparing two selected horses', async () => {
    render(<App />);
    await waitFor(() => screen.getByText(/Thunderdash/i));

    // Select Thunderdash (using FormControlLabel for Material-UI Checkbox)
    fireEvent.click(screen.getByLabelText(/Thunderdash/i));

    // Select Spirit (using FormControlLabel for Material-UI Checkbox)
    fireEvent.click(screen.getByLabelText(/Spirit/i));

    // Compare horses
    fireEvent.click(screen.getByRole("button", { name: /compare selected horses/i }));

    await waitFor(() => screen.getByText(/Horse Comparison/i));
    expect(screen.getByText(/Thunderdash/i)).toBeInTheDocument();
    expect(screen.getByText(/Spirit/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /back to list/i }));
    await waitFor(() => expect(screen.getByText(/Thunderdash/i)).toBeInTheDocument());
  });
});
