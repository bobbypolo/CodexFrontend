import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../src/components/ui/button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: {
    children: "Launch review lane",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};
