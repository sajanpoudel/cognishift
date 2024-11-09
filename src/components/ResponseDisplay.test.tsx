import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResponseDisplay from './ResponseDisplay';

const response = { original: 'Original text', humanized: 'Humanized text', aiScore: 0.1234 };

describe('ResponseDisplay', () => {
  it('shows the original response', () => {
    render(<ResponseDisplay response={response} />);
    expect(screen.getByText('Original text')).toBeInTheDocument();
  });
});
