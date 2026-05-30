import { test, expect } from '@playwright/test';

test.describe('Task manager E2E', () => {
  test('lists tasks and filters by status', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Gerenciador de Tarefas')).toBeVisible();
    await expect(page.getByText(/Configurar ambiente/i)).toBeVisible();

    await page.getByTestId('filter-status').selectOption('pending');
    await expect(page.getByText(/Configurar ambiente/i)).not.toBeVisible();
    await expect(page.getByText(/Revisar pull requests/i)).not.toBeVisible();
  });

  test('creates, edits and deletes a task', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('new-task-btn').click();
    await page.getByLabel('Responsável *').selectOption({ label: 'Ana Silva' });
    await page.getByLabel('Título *').fill('E2E Task');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByTestId('task-list').getByText('E2E Task')).toBeVisible();

    await page.getByRole('button', { name: 'Editar E2E Task' }).click();
    await page.getByLabel('Título *').fill('E2E Task Updated');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByTestId('task-list').getByText('E2E Task Updated')).toBeVisible();

    await page.getByRole('button', { name: 'Excluir E2E Task Updated' }).click();
    await page.getByTestId('confirm-delete').click();
    await expect(page.getByRole('dialog', { name: 'Confirmar exclusão' })).toBeHidden();
    await expect(page.getByTestId('task-list')).not.toContainText('E2E Task Updated');
  });

  test('shows error when list simulation is enabled', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Configurar ambiente/i)).toBeVisible();

    await page.getByTestId('simulate-error').selectOption('tasks-list');
    await expect(page.getByTestId('error-state')).toBeVisible({ timeout: 10000 });
  });
});
