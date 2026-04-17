import { createElement } from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light';

      return createElement(
        'div',
        {
          'data-theme': theme,
          style: {
            minHeight: '100vh',
            padding: 24,
            background: theme === 'dark' ? '#020617' : '#efe6d7',
            color: theme === 'dark' ? '#f8fafc' : '#102133',
          },
        },
        createElement(Story),
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'paper',
      values: [
        { name: 'paper', value: '#efe6d7' },
        { name: 'ink', value: '#102133' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      element: '#storybook-root',
      test: 'error',
    },
    chromatic: {
      pauseAnimationAtEnd: true,
    },
    options: {
      storySort: {
        order: ['Foundations'],
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Reference theme for visual review.',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
};

export default preview;
