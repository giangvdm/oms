// Set up global test timeouts
jest.setTimeout(10000);

// Suppress console log output during tests
console.log = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});