export interface FormOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'multiline' | 'select' | 'radio' | 'checkbox' | 'switch' | 'date';
  required?: boolean;
  options?: FormOption[];
}

export interface FormConfig {
  title: string;
  fields: FormField[];
}

// Tipo para o estado do formulário
export type FormDataState = Record<string, string | boolean>;