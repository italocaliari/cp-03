# Checkpoint 3 - Formulário Dinâmico com React Native

## 📋 Sobre o Projeto
Este projeto consiste em um aplicativo React Native desenvolvido com Expo que gera um formulário de cadastro dinamicamente a partir de uma configuração JSON. O objetivo é demonstrar o uso de Hooks avançados, persistência de dados local e validações de regras de negócio.

## 👥 Integrantes
* **Nome:** italo caliari silva - **RM:** rm 554758

## 🚀 Tecnologias Utilizadas
* **React Native / Expo**
* **TypeScript** (Tipagem estrita para segurança do código)
* **AsyncStorage** (Persistência de dados local)
* **Hooks:** `useState`, `useEffect`, `useMemo`, `useCallback`

## ⚙️ Funcionalidades e Regras de Negócio
O aplicativo segue as seguintes diretrizes:
1. **Renderização Dinâmica:** Os campos são gerados automaticamente baseados no arquivo `formConfig.ts`.
2. **Tipos de Campos:** Suporte para Texto, E-mail, Senha, Número (Idade), Multiline (Bio), Radio (Gênero), Select (Estado), Switch (Notificações) e Data.
3. **Persistência:** Os dados salvos permanecem no dispositivo mesmo após fechar o app ou atualizar a página (via AsyncStorage).
4. **Validações Estritas:**
   - **E-mail:** Validação de formato (presença do caractere `@`).
   - **Idade:** Bloqueio de valores negativos ou acima de 110 anos.
   - **Data:** Validação de formato padrão `DD/MM/AAAA`.
   - **Campos Obrigatórios:** O botão de salvar só é habilitado após o preenchimento de todos os itens marcados com `*`.

## 📦 Como Executar
1. Clone o repositório:
   ```bash
   git clone [https://github.com/italocaliari/cp-03.git](https://github.com/italocaliari/cp-03.git)
