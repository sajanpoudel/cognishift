import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResponseDisplay from './ResponseDisplay';

const response = { original: 'Original text', humanized: 'Humanized text', aiScore: 0.1234 };

describe('ResponseDisplay', () => {
  it('shows the original response', () => {
    render(<ResponseDisplay response={response} />);
    expect(screen.getByText('Original text')).toBeInTheDocument();
  });

  it('shows the humanized response', () => {
    render(<ResponseDisplay response={response} />);
    expect(screen.getByText('Humanized text')).toBeInTheDocument();
  });

  it('shows the score as a percentage with two decimals', () => {
    render(<ResponseDisplay response={response} />);
    expect(screen.getByText('12.34% AI-generated')).toBeInTheDocument();
  });

  it('hides the score section when there is no score', () => {
    render(<ResponseDisplay response={{ ...response, aiScore: null }} />);
    expect(screen.queryByText('AI Detection Score:')).not.toBeInTheDocument();
  });

  it('shows a score of zero', () => {
    render(<ResponseDisplay response={{ ...response, aiScore: 0 }} />);
    expect(screen.getByText('0.00% AI-generated')).toBeInTheDocument();
  });
});
