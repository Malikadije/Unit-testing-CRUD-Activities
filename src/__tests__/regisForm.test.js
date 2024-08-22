import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../components/regisForm';

describe('Register Component', () => {
  let alertSpy;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
    localStorage.clear();
  });

  it('Menampilkan alert dengan pesan "Registration successful" saat registrasi berhasil', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Registration successful');
    });

    const users = JSON.parse(localStorage.getItem('users'));
    expect(users).toEqual([{ username: 'newuser', password: 'password123' }]);
  });

  it('Menampilkan alert dengan pesan "Username already exists" jika username sudah terdaftar', async () => {
    // Mock existing user in localStorage
    const users = [{ username: 'existinguser', password: 'password123' }];
    localStorage.setItem('users', JSON.stringify(users));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'existinguser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Username already exists');
    });

    const updatedUsers = JSON.parse(localStorage.getItem('users'));
    expect(updatedUsers).toEqual([{ username: 'existinguser', password: 'password123' }]);
  });
});
