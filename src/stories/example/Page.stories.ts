import type { Meta, Story } from '@storybook/vue3'

import * as HeaderStories from './Header.stories'
import MyPage from './Page.vue'

export default {
  title: 'Example/Page',
  component: MyPage,
} as Meta

const Template: Story = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { MyPage },
  // The story's `args` need to be mapped into the template through the `setup()` method

  setup() {
    // Story args can be mapped to keys in the returned object
    return { user: args['user'] as Record<string, unknown> }
  },
  // Then, those values can be accessed directly in the template
  template: '<my-page :user="user" />',
})

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  ...HeaderStories.LoggedIn.args,
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args,
}
