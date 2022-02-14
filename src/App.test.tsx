import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './screens/home/Home';


/**
 * @todo: Add proper tests
 */
test('renders app', () => {
  render(<App />);
  expect(true).toBe(true);
});
