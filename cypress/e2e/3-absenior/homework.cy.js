/// <reference types="cypress" />

context('Login', () => {
    beforeEach(() => {
        cy.visit('https://absenior.vercel.app');
    });

    function realizarLogin() {
        cy.get('button').contains('Entrar').click();
        cy.get('#email').type(Cypress.env('email'));
        cy.get('#password').type(Cypress.env('senha'));
        cy.get('button').contains('Confirmar').click();
    }

    function irAteHomework() {
        cy.get('#Menu').click();
        cy.get('div').contains('Tarefas').click();
    }

    it('Deve adicionar nova tarefa com todas questões', () => {
        realizarLogin();
        irAteHomework();

        cy.get('button').contains('Nova Tarefa').click();
        cy.get('#enunciado').type('Titulo Teste');
        cy.get('#comando').type('Comando Teste');
        cy.get('#letra-a').type('Letra A');
        cy.get('#letra-b').type('Letra B');
        cy.get('#letra-c').type('Letra C');
        cy.get('#letra-d').type('Letra D');
        cy.get('button').contains('Adicionar Nova Tarefa').click();

        cy.get('#swal2-title').should('have.text','Sucesso!');
        cy.get('#swal2-html-container').should('have.text','Tarefa cadastrada com sucesso.');
    });

    it('Deve emitir erro ao tentar inserir tarefa com titulo e comando em branco', () => {
        realizarLogin();
        irAteHomework();
        
        cy.get('button').contains('Nova Tarefa').click();
        cy.get('button').contains('Adicionar Nova Tarefa').click();

        cy.get('#swal2-title').should('have.text','Erro ao cadastrar!');
        cy.get('#swal2-html-container').should('have.text','Título e comando não podem ser vazio');
    });

    it('Deve emitir erro ao tentar inserir tarefa com titulo em branco', () => {
        realizarLogin();
        irAteHomework();

        cy.get('button').contains('Nova Tarefa').click();
        cy.get('#comando').type('Comando Teste');
        cy.get('button').contains('Adicionar Nova Tarefa').click();

        cy.get('#swal2-title').should('have.text','Erro ao cadastrar!');
        cy.get('#swal2-html-container').should('have.text','Título e comando não podem ser vazio');
    });

    it('Deve emitir erro ao tentar inserir tarefa com comando em branco', () => {
        realizarLogin();
        irAteHomework();

        cy.get('button').contains('Nova Tarefa').click();
        cy.get('#enunciado').type('Titulo Teste');
        cy.get('button').contains('Adicionar Nova Tarefa').click();

        cy.get('#swal2-title').should('have.text','Erro ao cadastrar!');
        cy.get('#swal2-html-container').should('have.text','Título e comando não podem ser vazio');
        
    });

    it('Deve pesquisar tarefa', () => {
        realizarLogin();
        irAteHomework();

        cy.get('input[placeholder="Digite o título da tarefa"]').type('Titulo Teste');
        cy.get('div').contains('Titulo Teste').click();
        cy.get('h1').should('have.text', 'Titulo Teste');
    });

    it('Deve excluir tarefa', () => {
        realizarLogin();
        irAteHomework();

        cy.get('button').contains('Deletar').click();
        cy.get('button').contains('Sim, quero deletar!').click();

        cy.get('button').contains('OK').click();

    
        cy.get('div').find('Titulo Teste').should('have.length', 0);
    });

    it('Deve voltar a tela de pesquisa de tarefas', () => {
        realizarLogin();
        irAteHomework();

        cy.get('button').contains('Nova Tarefa').click();
        cy.get('button').contains('Voltar ').click();

        cy.location('pathname').should('include', 'homework');
    });
});