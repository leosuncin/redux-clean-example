import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { render } from '../utils/test';
import Counter from './Counter';

describe('<Counter />', () => {
  it('should render', () => {
    render(<Counter />);

    expect(screen.getByText('0')).toBeDefined();
  });

  it('should increment the count', () => {
    render(<Counter />);

    expect(screen.getByText('0')).toBeDefined();

    user.click(screen.getByRole('button', { name: 'Increment value' }));

    expect(screen.getByText('1')).toBeDefined();
  });

  it('should decrement the count', () => {
    render(<Counter />);

    expect(screen.getByText('0')).toBeDefined();

    user.click(screen.getByRole('button', { name: 'Decrement value' }));

    expect(screen.getByText('-1')).toBeDefined();
  });

  it('should increment the count by amount', () => {
    render(<Counter />);

    expect(screen.getByText('0')).toBeDefined();

    user.type(
      screen.getByRole('textbox', { name: 'Set increment amount' }),
      '{selectall}4',
    );
    user.click(screen.getByRole('button', { name: 'Add Amount' }));

    expect(screen.getByText('4')).toBeDefined();
  });

  it('should increment the count by amount (async)', async () => {
    render(<Counter />);

    expect(screen.getByText('0')).toBeDefined();

    user.type(
      screen.getByRole('textbox', { name: 'Set increment amount' }),
      '{selectall}42',
    );
    user.click(screen.getByRole('button', { name: 'Add Async' }));

    expect(await screen.findByText('42')).toBeDefined();
  });

  it('should increment the count by amount if odd', async () => {
    render(<Counter />);

    expect(screen.getByText('0')).toBeDefined();

    user.click(screen.getByRole('button', { name: 'Add If Odd' }));

    expect(screen.getByText('0')).toBeDefined();

    user.click(screen.getByRole('button', { name: 'Increment value' }));
    user.click(screen.getByRole('button', { name: 'Add If Odd' }));

    expect(await screen.findByText('3')).toBeDefined();
  });
});
