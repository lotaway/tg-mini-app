Web running Telegram Mini Program

# config for https for tg bot:
https://docs.ton.org/mandarin/develop/dapps/telegram-apps/

```shell
yarn add @vitejs/plugin-basic-ssl
```

in vite.config.ts:
```ts
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
    plugins: [
        basicSsl(),
        // ...other config
    ],
})
```

install ngrok for internet:
```shell
npm -g ngrok
```

# dev

```shell
ngrok http https://localhost:18088/
```