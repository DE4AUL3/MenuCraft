// Jest setup file (CommonJS)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mocking Next.js URL methods that aren't available in test environment
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn()
  }),
  usePathname: jest.fn().mockReturnValue('/')
}));
