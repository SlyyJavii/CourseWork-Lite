import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';

let loginMock;

// Use a shared mock and inject it into the mock definition
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock = vi.fn(); // Reset mock before each test
  });

  it('renders login form elements', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('submits login with valid credentials', async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue(true); // Successful login mock

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'correct@example.com');
    await user.type(screen.getByLabelText(/password/i), 'correctpass');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(loginMock).toHaveBeenCalledWith('correct@example.com', 'correctpass');
  });

  it('shows error message when login fails', async () => {
    const user = userEvent.setup();

    loginMock.mockRejectedValue({
      response: {
        data: {
          detail: 'Invalid credentials',
        },
      },
    });

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
