import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// Combine basic config with test config
export default mergeConfig(
     viteConfig,
     defineConfig({
        test: {
            // Enable using describe,it,... without maually import
            globals: true,
            // Simulate browser enviroment
            environment: "jsdom",
            // Path to a file that runs before every test (useful for matchers)
            setupFiles: "./src/test/setup.ts",
            // Process css without fail
            css: true,
            coverage: {
                provider: 'v8',
                reporter: ['text', 'json', 'html'], // 'html' creates a clickable website report
                exclude: [
                    'node_modules/',
                    'src/test/setup.ts',
                ],
            }
        }
     })
)