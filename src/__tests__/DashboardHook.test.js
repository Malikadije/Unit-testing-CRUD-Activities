import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import axios from 'axios';
import Dashboard from '../components/Dashboard';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({})),
  put: jest.fn(() => Promise.resolve({})),
  delete: jest.fn(() => Promise.resolve({})),
}));

describe('Dashboard Component', () => {
  test('Melakukan fetching data dan mendisplaynya', async () => {
    const activities = [
      { id: 1, name: 'Activity 1', date: '01-01-2024' },
      { id: 2, name: 'Activity 2', date: '02-01-2024' },
    ];

    axios.get.mockResolvedValueOnce({ data: activities });

    render(<Dashboard />);

    // Memastikan data berhasil di fetch dan didisplay dengan benar
    await waitFor(() => {
      expect(screen.getByText('Activity 1')).toBeInTheDocument();
      expect(screen.getByText('Activity 2')).toBeInTheDocument();
    });

    // Memastikan api dipanggil sekali
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('Harus menampilkan "No activities found" jika tidak ada data', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('No activities found.')).toBeInTheDocument();
    });
  });
});
