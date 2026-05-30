import { z } from 'zod';

export const taskFormSchema = z.object({
  userId: z.string().min(1, 'Responsável é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  status: z.enum(['pending', 'in_progress', 'done'], {
    required_error: 'Status é obrigatório',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Prioridade é obrigatória',
  }),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const createTaskSchema = taskFormSchema;
