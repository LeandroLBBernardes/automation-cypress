/// <reference types="cypress" />

context('Register', () => {
    beforeEach(() => {
        cy.visit('https://absenior.vercel.app');
    });

    it('Deve entrar na tela de cadastro a partir do início', () => {
        cy.get('button').contains('Cadastrar').click();
        cy.location('pathname').should('include', 'register');
    });
});