# 🛒 Desafio Mercado Livre

Olá! Primeiramente, muito obrigado pela oportunidade de apresentar este teste. Fiquei muito feliz em poder mostrar minhas habilidades e espero que você goste do resultado! 🚀

## Como rodar o projeto

1. Faça o clone ou download do repositório.
2. Na pasta raiz do projeto, execute:

   ```bash
   yarn install
   ```

3. Após a instalação das dependências, rode:

   ```bash
   yarn start
   ```

   *Esse comando fará o build de todos os subprojetos e, em seguida, iniciará a aplicação.*

## Sobre o desafio e minhas implementações

- **Frameworks e tecnologias utilizadas**:
  - React com TypeScript
  - SCSS no padrão BEM
  - Redux para gerenciamento de estado global
  - Navegação entre páginas que utiliza os mesmos dados (retorno dos 50 itens) e somente refaz a busca quando chega na última página
  - Layout responsivo para melhor experiência em diferentes dispositivos
  - Ao retornar da página de produto, o scroll se mantém na posição anterior, garantindo uma navegação mais fluida

### Estrutura e modularização

Optei por uma organização mais modular, pensando em escalabilidade, começando a migração do projeto para **microfrontends** e **design system**.

- **Pasta raiz**: Gerencia os *workspaces* (usei assim para facilitar o processo de build).
- **api** (porta 5000): Contém o servidor que consulta a API do Mercado Livre e retorna os dados para a aplicação.
- **design system** (porta 3002): Criei para padronização de layout, facilitando o reuso de componentes, tematização, rebranding e novas implementações de forma independente.
- **microfrontend** (porta 3001): Pensado em escalabilidade, removendo a necessidade de compilar toda a aplicação para cada atualização. Podemos servir componentes como módulos independentes.
- **main-system**: Aplicação padrão. Aqui criei os componentes, organizei os *hooks* e *styles*, e utilizei Redux para gerenciar estados. Também implementei testes automatizados com Jest e otimizei SEO usando *Helmet* (manipulando `title`, `meta` e atributos `alt`).

### Patterns e ferramentas utilizadas

- **ESLint** e **Prettier** para padronização de código.
- **Storybook** para documentar e visualizar componentes isoladamente.
- **Babel** e **Webpack** para configurar o build e *bundle* de todos os subprojetos.
- **TypeScript** para tipagem estática e melhor confiabilidade do código.
- **Redux** para gerenciamento de estado global.

## Próximos passos

- Finalizar a migração dos fronts para o **microfrontend** e dos componentes para o **design system**, além de criar *tokens* e temas.
- Implementar **internacionalização** (i18n).
- Tratar exceções de forma mais robusta.
- Aumentar a cobertura de testes automatizados (testes de interface, testes visuais e testes de contrato).
- Remover quaisquer conteúdos *hardcoded* que ainda existam.

---

**Espero que gostem do projeto!** Qualquer dúvida ou sugestão, fique à vontade para entrar em contato. ✨ Muito obrigado pela oportunidade novamente!
