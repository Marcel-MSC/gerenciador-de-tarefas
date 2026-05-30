import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { HomePage } from './HomePage';
import { createRepositories } from '@/di/container';
import { createTestProviders } from '@/test/fakes/createTestProviders';
import { server } from '@/infrastructure/msw/server';

function renderHome() {
  const repositories = createRepositories();
  return render(createTestProviders(repositories, <HomePage />));
}

describe('HomePage integration', () => {
  it('loads and displays tasks from API', async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByText(/Configurar ambiente/i)).toBeInTheDocument();
    });
  });

  it('shows error state when list fails', async () => {
    server.use(
      http.get('/api/tasks', () =>
        HttpResponse.json({ message: 'Falha' }, { status: 500 }),
      ),
    );
    renderHome();
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('creates a task via form', async () => {
    const user = userEvent.setup();
    renderHome();

    await waitFor(() => {
      expect(screen.getByTestId('new-task-btn')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('new-task-btn'));
    await user.selectOptions(screen.getByLabelText(/Responsável/i), 'u1');
    await user.type(screen.getByLabelText(/Título/i), 'Tarefa criada no teste');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(screen.getByText('Tarefa criada no teste')).toBeInTheDocument();
    });
  });
});
