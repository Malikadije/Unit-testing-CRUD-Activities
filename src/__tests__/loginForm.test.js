import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/loginForm';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  let alertSpy;
  
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  test('Render Login form dan elemen lainnya', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Masuk/i })).toBeInTheDocument();
  });

  test('Menampilkan error message jika input kosong dan user men-submit form', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Masuk/i }));

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('Berhasil login dan navigasi ke dashboard', async () => {
    const mockUser = { username: 'user123', password: 'password123' };
    localStorage.setItem('users', JSON.stringify([mockUser]));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'user123' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Masuk/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Berhasil Login!');
    });

    expect(localStorage.getItem('auth')).toEqual(JSON.stringify(mockUser));
  });

  test('Menampilkan error jika login gagal', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Masuk/i }));

    expect(localStorage.getItem('auth')).toBeNull();
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  test('Otomatis redirect ke dashboard jika sudah login', () => {
    const mockUser = { username: 'user123', password: 'password123' };
    localStorage.setItem('auth', JSON.stringify(mockUser));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
