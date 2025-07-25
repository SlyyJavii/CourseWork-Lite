import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

// Mock environment variables at the top
Object.defineProperty(process, 'env', {
  value: {
    ...process.env,
    VITE_API_BASE_URL: 'http://localhost:8000'
  }
});

// Mock your axios API client
vi.mock('./api/axios', () => {
  const mockApiClient = {
    post: vi.fn(),
    get: vi.fn(() => Promise.resolve({ data: [] })),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  };
  
  return {
    default: mockApiClient,
  };
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('App Integration', () => {
  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Reset localStorage
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Get the mocked api client and set up responses
    const { default: apiClient } = await import('./api/axios.js');
    apiClient.post.mockResolvedValue({
      data: { access_token: 'fake-token-123' }
    });
    
    // Set initial route
    window.location.hash = '#/login';
  });

  it('logs in and redirects to dashboard', async () => {
    const user = userEvent.setup();
    const { default: apiClient } = await import('./api/axios.js');

    render(<App />);

    // Should show login form initially
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Fill login form
    await user.type(screen.getByLabelText(/email/i), 'correct@example.com');
    await user.type(screen.getByLabelText(/password/i), 'correctpass');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /log in/i }));

    // Wait for API call to be made
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/users/login',
        expect.any(URLSearchParams),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
    });

    // Check that the form data was sent correctly
    const formData = apiClient.post.mock.calls[0][1];
    expect(formData.get('username')).toBe('correct@example.com');
    expect(formData.get('password')).toBe('correctpass');

    // Wait for localStorage to be called
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'fake-token-123');
    });

    // Wait for redirect to dashboard
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('shows error message when login fails', async () => {
    const user = userEvent.setup();
    const { default: apiClient } = await import('./api/axios.js');

    // Mock failed login
    apiClient.post.mockRejectedValue({
      response: { data: { detail: 'Invalid credentials' } }
    });

    render(<App />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    // Should still be on login page
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});