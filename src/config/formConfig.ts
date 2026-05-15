import { FormConfig } from '../types';

export const formConfig: FormConfig = {
  title: 'Cadastro de Usuário',
  fields: [
    { id: 'name', label: 'Nome', type: 'text', required: true },
    { id: 'email', label: 'E-mail', type: 'email', required: true },
    { id: 'password', label: 'Senha', type: 'password', required: true },
    { id: 'age', label: 'Idade', type: 'number', required: true },
    { id: 'bio', label: 'Biografia', type: 'multiline', required: false },
    {
      id: 'gender',
      label: 'Gênero',
      type: 'radio',
      required: true,
      options: [
        { label: 'Masculino', value: 'male' },
        { label: 'Feminino', value: 'female' },
      ],
    },
    {
      id: 'state',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { label: 'SP', value: 'SP' },
        { label: 'RJ', value: 'RJ' },
      ],
    },
    { id: 'notifications', label: 'Receber Notificações', type: 'switch', required: false },
    { id: 'birthDate', label: 'Data de Nascimento', type: 'date', required: true },
  ],
};