import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TaskForm } from './TaskForm';

const users = [{ id: 'u1', name: 'Ana', email: 'a@t.com' }];

describe('TaskForm validation', () => {
  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(
      <TaskForm
        users={users}
        onSubmit={async () => {}}
        onCancel={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Responsável é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Título é obrigatório')).toBeInTheDocument();
  });
});
