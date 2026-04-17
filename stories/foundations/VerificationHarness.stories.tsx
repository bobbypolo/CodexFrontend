import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

type FormTone = 'neutral' | 'server-error';

type EmailCaptureCardProps = {
  helperText?: string;
  initialValue?: string;
  tone?: FormTone;
};

const frameStyle: CSSProperties = {
  width: 'min(100%, 480px)',
  borderRadius: 24,
  padding: 24,
  background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
  color: '#0f172a',
  fontFamily:
    '"Segoe UI", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
};

const fieldStyle: CSSProperties = {
  width: '100%',
  borderRadius: 16,
  border: '1px solid #cbd5e1',
  padding: '12px 14px',
  fontSize: 16,
  lineHeight: 1.5,
};

const buttonStyle: CSSProperties = {
  width: '100%',
  border: 0,
  borderRadius: 16,
  padding: '12px 16px',
  fontSize: 16,
  fontWeight: 700,
  background: '#0f172a',
  color: '#f8fafc',
  cursor: 'pointer',
};

function EmailCaptureCard({
  helperText = 'Keyboard-only path, validation, and async feedback all live here.',
  initialValue = '',
  tone = 'neutral',
}: EmailCaptureCardProps) {
  const [email, setEmail] = useState(initialValue);
  const [error, setError] = useState<string | null>(
    tone === 'server-error' ? 'The backend rejected this request. Retry after syncing tokens.' : null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isSaving) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [isSaving]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.includes('@')) {
      setError('Enter a valid email address before continuing.');
      setIsSaved(false);
      return;
    }

    setError(null);
    setIsSaved(false);
    setIsSaving(true);
  }

  return (
    <form onSubmit={handleSubmit} style={frameStyle}>
      <div style={{ display: 'grid', gap: 18 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#475569',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Verification Harness
          </span>
          <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.1 }}>
            Review interaction, validation, loading, and recovery in one place.
          </h2>
          <p style={{ margin: 0, color: '#475569', fontSize: 15 }}>{helperText}</p>
        </div>

        <label htmlFor="email" style={{ display: 'grid', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Work email</span>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby="email-status"
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
              setIsSaved(false);
            }}
            placeholder="team@company.com"
            style={{
              ...fieldStyle,
              outline: '3px solid transparent',
              boxShadow: error ? '0 0 0 1px #dc2626 inset' : 'none',
            }}
          />
        </label>

        <button disabled={isSaving} style={{ ...buttonStyle, opacity: isSaving ? 0.75 : 1 }} type="submit">
          {isSaving ? 'Saving...' : 'Save state'}
        </button>

        <div
          aria-live="polite"
          id="email-status"
          style={{
            minHeight: 24,
            fontSize: 14,
            fontWeight: 600,
            color: error ? '#b91c1c' : '#166534',
          }}
        >
          {error}
          {!error && isSaved ? 'Saved. The success state is ready for visual review.' : null}
        </div>
      </div>
    </form>
  );
}

const meta = {
  title: 'Foundations/Verification Harness',
  component: EmailCaptureCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmailCaptureCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InteractiveValidation: Story = {
  args: {
    initialValue: '',
    tone: 'neutral',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Work email');
    const button = canvas.getByRole('button', { name: 'Save state' });

    await userEvent.tab();
    await expect(input).toHaveFocus();

    await userEvent.click(button);
    await expect(canvas.getByText('Enter a valid email address before continuing.')).toBeVisible();

    await userEvent.clear(input);
    await userEvent.type(input, 'design.systems@codex.dev');
    await userEvent.keyboard('{Enter}');

    await expect(canvas.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    await waitFor(async () => {
      await expect(
        canvas.getByText('Saved. The success state is ready for visual review.'),
      ).toBeVisible();
    });
  },
};

export const ServerRecovery: Story = {
  args: {
    initialValue: 'recover@codex.dev',
    tone: 'server-error',
    helperText: 'Keep a visible server-failure state around so review and remediation stay deterministic.',
  },
};
