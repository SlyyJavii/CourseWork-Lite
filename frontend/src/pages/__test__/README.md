# CourseWork Lite — Frontend Testing Setup

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) to test React components in a Vite project.

---

## Testing Setup Instructions

Follow these steps to enable unit testing in your Vite + React project:

---

### 1. Install Dev Dependencies

Run this command in the `frontend` directory to install testing tools:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event 
```
### 2. Create a vite.config.js File

If your project didn’t have a `vite.config.js`, create it in the root of `frontend`:

```bash
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
```
### 3. Create setupTests.js

In `src`, create a file called setupTests.js with this content

```bash
import '@testing-library/jest-dom';
```

### 4. Write a Test Example

Create a test file in __test__ folder

### 5. Run the Tests

run this command from the `frontend` directory

```bash
npx vitest run
```

