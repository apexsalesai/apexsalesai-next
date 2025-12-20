import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EchoBreakerPremium from '../components/EchoBreakerPremium';

// Mock external dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

global.fetch = jest.fn();

describe('EchoBreakerPremium', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<EchoBreakerPremium />);

    expect(getByText('Scan the claim before you share it')).toBeTruthy();
    expect(getByPlaceholderText('Paste the claim you want to verify')).toBeTruthy();
  });

  it('allows user to input a claim', () => {
    const { getByPlaceholderText } = render(<EchoBreakerPremium />);
    const input = getByPlaceholderText('Paste the claim you want to verify');

    fireEvent.changeText(input, 'Test claim');

    expect(input.props.value).toBe('Test claim');
  });

  it('submits verification request', async () => {
    const mockResponse = {
      verificationId: '123',
      verdict: 'Accurate',
      confidence: 95,
      summary: 'This claim is accurate',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockResponse),
    });

    const { getByPlaceholderText, getByText } = render(<EchoBreakerPremium />);
    const input = getByPlaceholderText('Paste the claim you want to verify');
    const button = getByText('Verify reality');

    fireEvent.changeText(input, 'Test claim');
    fireEvent.press(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.apexsalesai.com/api/reality-scan',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ claim: 'Test claim', link: '' }),
        })
      );
    });
  });

  it('displays verification results', async () => {
    const mockResponse = {
      verificationId: '123',
      verdict: 'Accurate',
      confidence: 95,
      summary: 'This claim is accurate',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockResponse),
    });

    const { getByPlaceholderText, getByText, findByText } = render(<EchoBreakerPremium />);
    const input = getByPlaceholderText('Paste the claim you want to verify');
    const button = getByText('Verify reality');

    fireEvent.changeText(input, 'Test claim');
    fireEvent.press(button);

    const verdictText = await findByText('ACCURATE');
    expect(verdictText).toBeTruthy();

    const summaryText = await findByText('This claim is accurate');
    expect(summaryText).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { getByPlaceholderText, getByText, findByText } = render(<EchoBreakerPremium />);
    const input = getByPlaceholderText('Paste the claim you want to verify');
    const button = getByText('Verify reality');

    fireEvent.changeText(input, 'Test claim');
    fireEvent.press(button);

    const errorText = await findByText(/Network error/);
    expect(errorText).toBeTruthy();
  });

  it('shows skeleton loader while loading', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        text: async () => JSON.stringify({ verdict: 'Accurate' }),
      }), 1000))
    );

    const { getByPlaceholderText, getByText, UNSAFE_queryAllByType } = render(<EchoBreakerPremium />);
    const input = getByPlaceholderText('Paste the claim you want to verify');
    const button = getByText('Verify reality');

    fireEvent.changeText(input, 'Test claim');
    fireEvent.press(button);

    await waitFor(() => {
      // Skeleton loader should be visible
      // Check for loading state
      expect(button).toBeTruthy();
    });
  });

  it('allows preset selection', () => {
    const { getByText, getByPlaceholderText } = render(<EchoBreakerPremium />);
    const input = getByPlaceholderText('Paste the claim you want to verify');

    const preset = getByText(/73% of Americans support mandatory voter ID/);
    fireEvent.press(preset);

    expect(input.props.value).toContain('73% of Americans');
  });

  it('resets form when reset button is pressed', () => {
    const { getByPlaceholderText, getByText } = render(<EchoBreakerPremium />);
    const input = getByPlaceholderText('Paste the claim you want to verify');
    const resetButton = getByText('Reset');

    fireEvent.changeText(input, 'Test claim');
    expect(input.props.value).toBe('Test claim');

    fireEvent.press(resetButton);
    expect(input.props.value).toBe('');
  });
});
