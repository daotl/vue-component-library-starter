import { type UserModule } from '~/types'

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = ({ isClient, router }) => {
  if (!isClient) {
    return
  }

  void router.isReady().then(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { registerSW } = await import('virtual:pwa-register')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    registerSW({ immediate: true })
  })
}
