import type { Meta, StoryObj } from "@storybook/react-vite";
import App from "../src/App";

const meta = {
  title: "Surfaces/App",
  component: App,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof App>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
