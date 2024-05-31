import {defineConfig, ProxyOptions} from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from "path"
// import copy from 'vite-plugin-copy'
import fs from 'fs'
// import glsl from 'vite-plugin-glsl'
import basicSsl from '@vitejs/plugin-basic-ssl'

const nginxConfig = fs.readFileSync(resolve(__dirname, 'public/nginx.conf'), 'utf8')
const locationRegex = /location\s+\^~\s+\/([\w\/]+)\s+\{([\s\S]*?)\}/g
let proxy: Record<string, ProxyOptions> = {}
let match
while ((match = locationRegex.exec(nginxConfig)) !== null) {
    // For each location block found, split it into lines and filter out commented lines
    const lines = match[2].split('\n').filter(line => !line.trim().startsWith('#'))

    // Join the filtered lines back together
    const filteredBlock = lines.join('\n')

    // Now, you can process the filteredBlock further, for example, to extract the proxy_pass value
    const proxyPassRegex = /proxy_pass\s+(http[s]?:\/\/[^;]+);/
    const proxyPassMatch = proxyPassRegex.exec(filteredBlock)
    if (proxyPassMatch) {
        console.log(`Matched proxy_pass for location /${match[1]}: ${proxyPassMatch[1]}`)
        const matchPrefix = `/${match[1]}`
        const target = proxyPassMatch[1]
        proxy[matchPrefix] = {
            target,
            changeOrigin: true,
            rewrite: (path: string) => path.replace(new RegExp(`^${matchPrefix}`), ''),
        }
    } else {
        console.log("No match")
    }
}
// console.log(proxy)
// Object.values(proxy).forEach(item => console.log(item.rewrite?.toString()))

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // copy({
        //   patterns: [
        //     { from: '.well-known', to: '.well-known' }
        //   ]
        // }),
        basicSsl(),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@assets': resolve(__dirname, 'src/assets'),
            '@pages': resolve(__dirname, 'src/pages'),
            '@store': resolve(__dirname, 'src/store'),
            '@api': resolve(__dirname, 'src/api'),
            '@utils': resolve(__dirname, 'src/utils'),
        }
    },
    server: {
        host: 'localhost',
        port: 18088,
        proxy,
    },
    build: {
    }
})
