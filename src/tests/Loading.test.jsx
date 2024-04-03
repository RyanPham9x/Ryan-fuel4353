import React from 'react';
import '@testing-library/jest-dom';
import { render,screen } from '@testing-library/react';
import LoadingSpinner from '../components/Loading';

// Testing for rendering
test('Rendering loading test', () => {
      const { getByText } = render(<LoadingSpinner />);
      const element = screen.getByText('Loading...');
      expect(element).toBeInTheDocument();
    });