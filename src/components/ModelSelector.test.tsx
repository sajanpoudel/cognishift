import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ModelSelector from './ModelSelector';

describe('ModelSelector', () => {
  it('shows the name of the selected model', () => {
    render(<ModelSelector selectedModel="openai" onSelectModel={vi.fn()} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('OpenAI');
  });
});
