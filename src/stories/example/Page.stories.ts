import type { Meta, StoryObj } from '@storybook/vue3'

import MyPage from './Page.vue'

const meta: Meta<typeof MyPage> = {
  title: 'Example/Page',
  component: MyPage,
}

export default meta

type Story = StoryObj<typeof MyPage>

const Template: Story = {
  render: args => ({
    // Components used in your story `template` are defined in the `components` object
    components: { MyPage },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
      // Story args can be spread into the returned object
      return { args }
    },
    // Then, the spread values can be accessed directly in the template
    template: '<my-Page :user="user" />',
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
