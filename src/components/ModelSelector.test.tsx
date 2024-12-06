import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ModelSelector from './ModelSelector';

describe('ModelSelector', () => {
  it('shows the name of the selected model', () => {
    render(<ModelSelector selectedModel="openai" onSelectModel={vi.fn()} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('OpenAI');
  });

  it('shows Gemini when it is selected', () => {
    render(<ModelSelector selectedModel="gemini" onSelectModel={vi.fn()} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Gemini');
  });

  it('asks to select a model when the id is unknown', () => {
    render(<ModelSelector selectedModel="other" onSelectModel={vi.fn()} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Select Model');
  });
});
