import type { Meta, StoryObj } from '@storybook/vue3'

import MyHeader from './Header.vue'

const meta: Meta<typeof MyHeader> = {
  title: 'Example/Header',
  component: MyHeader,
}

export default meta

type Story = StoryObj<typeof MyHeader>

const Template: Story = {
  render: args => ({
  // Components used in your story `template` are defined in the `components` object
    components: { MyHeader },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
    // Story args can be spread into the returned object
      return { args }
    },
    // Then, the spread values can be accessed directly in the template
    template: '<my-header :user="user" />',
  }),
  args: {},
}

export const LoggedIn: Story = {
  ...Template,
  args: {
    user: {},
  },
}

export const LoggedOut: Story = {
  ...Template,
  args: {
    user: undefined,
  },
}
