import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const shellStyle: CSSProperties = {
  width: 'min(100%, 1040px)',
  display: 'grid',
  gap: 20,
  padding: 24,
  borderRadius: 28,
  background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
  color: '#0f172a',
  fontFamily:
    '"Segoe UI", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
};

const panelStyle: CSSProperties = {
  padding: 18,
  borderRadius: 20,
  border: '1px solid rgba(15, 23, 42, 0.08)',
  background: '#ffffff',
};

const cardStyle: CSSProperties = {
  borderRadius: 18,
  padding: 16,
  border: '1px solid rgba(15, 23, 42, 0.08)',
  background: '#ffffff',
};

const controlStates = [
  { name: 'Default', tone: '#0f172a', label: 'Action ready' },
  { name: 'Hover', tone: '#1d4ed8', label: 'Hover affordance' },
  { name: 'Focus', tone: '#7c3aed', label: 'Visible keyboard focus' },
  { name: 'Active', tone: '#0f766e', label: 'Pressed feedback' },
  { name: 'Disabled', tone: '#475569', label: 'Unavailable' },
  { name: 'Loading', tone: '#9a3412', label: 'Async in flight' },
  { name: 'Skeleton', tone: '#64748b', label: 'Waiting for data' },
];

function StateMatrix() {
  return (
    <div style={shellStyle}>
      <div style={{ display: 'grid', gap: 6 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#475569',
          }}
        >
          Review Contract
        </span>
        <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.1 }}>
          Reference every required UI state before merge.
        </h2>
        <p style={{ margin: 0, color: '#475569', fontSize: 15 }}>
          Default, hover, focus, active, disabled, loading, skeleton, empty,
          error, validation, overflow, mobile, and dark review all need an
          intentional surface.
        </p>
      </div>

      <section style={panelStyle}>
        <h3 style={{ marginTop: 0 }}>Control states</h3>
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          {controlStates.map((state) => (
            <article key={state.name} style={cardStyle}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 42,
                  minWidth: 120,
                  padding: '10px 14px',
                  borderRadius: 14,
                  fontWeight: 700,
                  color: '#f8fafc',
                  background: state.tone,
                  boxShadow:
                    state.name === 'Focus'
                      ? '0 0 0 4px rgba(124, 58, 237, 0.2)'
                      : 'none',
                }}
              >
                {state.name === 'Loading' ? 'Saving...' : 'Primary action'}
              </div>
              <h4 style={{ marginBottom: 4 }}>{state.name}</h4>
              <p style={{ margin: 0, color: '#475569', fontSize: 14 }}>
                {state.label}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <article style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Empty and error</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <div
              style={{
                ...cardStyle,
                background: '#f8fafc',
                borderStyle: 'dashed',
              }}
            >
              <strong>No items yet</strong>
              <p style={{ marginBottom: 0, color: '#475569' }}>
                Empty states need copy, spacing, and a next step.
              </p>
            </div>
            <div
              style={{
                ...cardStyle,
                borderColor: 'rgba(220, 38, 38, 0.24)',
                background: '#fef2f2',
              }}
            >
              <strong style={{ color: '#b91c1c' }}>Sync failed</strong>
              <p style={{ marginBottom: 0, color: '#7f1d1d' }}>
                Error states must preserve context and a recovery path.
              </p>
            </div>
          </div>
        </article>

        <article style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Overflow and responsive</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <div
              aria-label="Scrollable workflow layers"
              style={{
                ...cardStyle,
                display: 'grid',
                gap: 8,
                maxHeight: 132,
                overflow: 'auto',
              }}
              tabIndex={0}
            >
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={`overflow-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    paddingBottom: 8,
                    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                  }}
                >
                  <span>Layer {index + 1}</span>
                  <span style={{ color: '#475569' }}>Scrollable content</span>
                </div>
              ))}
            </div>
            <div
              style={{
                ...cardStyle,
                width: 240,
                background: '#0f172a',
                color: '#f8fafc',
              }}
            >
              <strong>Mobile shell</strong>
              <p style={{ marginBottom: 0, color: 'rgba(248, 250, 252, 0.76)' }}>
                A narrow layout must keep hierarchy and tap targets intact.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

const meta = {
  title: 'Foundations/State Matrix',
  component: StateMatrix,
  tags: ['autodocs'],
} satisfies Meta<typeof StateMatrix>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReviewStates: Story = {};
