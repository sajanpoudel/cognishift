import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ThemeToggle from './ThemeToggle';

const setTheme = vi.fn();
let theme = 'light';
vi.mock('next-themes', () => ({ useTheme: () => ({ theme, setTheme }) }));

beforeEach(() => {
  setTheme.mockClear();
  theme = 'light';
});

describe('ThemeToggle', () => {
  it('shows a moon in the light theme', () => {
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('svg.lucide-moon')).not.toBeNull();
  });

  it('switches to the dark theme when clicked', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('shows a sun in the dark theme', () => {
    theme = 'dark';
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('svg.lucide-sun')).not.toBeNull();
  });
});
