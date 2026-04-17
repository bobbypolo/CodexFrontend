export const STORYBOOK_URL = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6006';

export type StoryScenario = {
  id: string;
  name: string;
  viewport?: {
    width: number;
    height: number;
  };
};

export const smokeStories: StoryScenario[] = [
  {
    id: 'foundations-verification-harness--interactive-validation',
    name: 'Interactive validation',
  },
  {
    id: 'foundations-verification-harness--server-recovery',
    name: 'Server recovery',
  },
  {
    id: 'foundations-state-matrix--review-states',
    name: 'Review states',
  },
];

export const visualStories: StoryScenario[] = [
  {
    id: 'foundations-verification-harness--server-recovery',
    name: 'verification-harness-desktop',
    viewport: { width: 1440, height: 960 },
  },
  {
    id: 'foundations-state-matrix--review-states',
    name: 'state-matrix-desktop',
    viewport: { width: 1440, height: 1280 },
  },
  {
    id: 'foundations-state-matrix--review-states',
    name: 'state-matrix-mobile',
    viewport: { width: 430, height: 932 },
  },
];

export function storyUrl(id: string) {
  return `${STORYBOOK_URL}/iframe.html?id=${id}&viewMode=story`;
}
