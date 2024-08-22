// __tests__/Dashboard.test.js
import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/Dashboard';

// Mocking axios untuk menghindari membuat request api asli
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({})),
  put: jest.fn(() => Promise.resolve({})),
  delete: jest.fn(() => Promise.resolve({})),
}));

// jest.mock(console.error);

describe('Dashboard Component', () => {
  // Simpan referensi asli dari console.error
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Gantikan console.error dengan fungsi kosong
    console.error = jest.fn();
  });

  afterEach(() => {
    // Pulihkan console.error ke fungsi aslinya
    console.error = originalConsoleError;
  });
  
  test('Render dashboard dan element2 lainnya', async () => {

    render(<Dashboard />);

    // Memastikan Title di render
    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    // Memastikan input field dirender
    expect(screen.getByPlaceholderText('Activity Name')).toBeInTheDocument();

    // Memastikan button tambah aktifitas ke render
    expect(screen.getByText('Add Activity')).toBeInTheDocument();

    // Untuk awalan, memastikan label tidak ada aktifitas ditampilkan
    expect(screen.getByText('No activities found.')).toBeInTheDocument();
  });

  test('Menambahkan aktifitas baru', async () => {
    render(<Dashboard />);

    const input = screen.getByPlaceholderText('Activity Name');
    const addButton = screen.getByText('Add Activity');

    // Menyimulasikan user input
    fireEvent.change(input, { target: { value: 'New Activity' } });

    // Mengklik button
    fireEvent.click(addButton);
  });
});
