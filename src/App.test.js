import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// TODO write real tests, delete this
test('nothing much', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Calculator/i);
  expect(linkElement).toBeInTheDocument();
});
