import { render, screen } from '@testing-library/react';
import ROICalculator from '../components/ROICalculator';

test('renders ROI Calculator header', () => {
  render(<ROICalculator />);
  expect(screen.getByText(/ROI Calculator/i)).toBeInTheDocument();
});

test('renders Export buttons', () => {
  render(<ROICalculator />);
  expect(screen.getByText(/Export PDF/i)).toBeInTheDocument();
  expect(screen.getByText(/Export CSV/i)).toBeInTheDocument();
  expect(screen.getByText(/Export JSON/i)).toBeInTheDocument();
});
// Add more tests for calculation logic, scenario save/load, and UI accessibility as needed.
