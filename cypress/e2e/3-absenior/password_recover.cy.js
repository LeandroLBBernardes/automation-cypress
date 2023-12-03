/// <reference types="cypress" />

context('PasswordRecover', () => {
    beforeEach(() => {
        cy.visit('https://absenior.vercel.app');
    });

    it('Deve enviar email corretamente', () => {
        cy.visit('https://absenior.vercel.app/emailresetpassword');
        cy.get('#email').type(Cypress.env('email'));

        cy.get('button').contains('Enviar Email').click();

        cy.get('#swal2-title').should('have.text','Sucesso!');
    });

    it('Deve navegar pra tela de esqueceu a senha', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('a').contains('Esqueci minha senha').click();

        cy.location('pathname').should('include', 'emailresetpassword');
    });

    it('Deve retornar pra tela de login', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('a').contains('Esqueci minha senha').click();
        cy.get('a').contains('Voltar ao Login').click();

        cy.location('pathname').should('include', 'login');
    });

    it('Deve retornar erro caso o email seja inválido', () => {
        cy.visit('https://absenior.vercel.app/emailresetpassword');
        cy.get('button').contains('Enviar Email').click();

        cy.get('#swal2-title').should('have.text','Erro ao enviar email!');
    });

    it('Deve sair som ao clicar no botão de microfone', () => {
        const state = {
            started: false,
            finished: false,
        }
    
        cy.visit('https://absenior.vercel.app/login').then(() => {
            const recognition = new webkitSpeechRecognition()
            recognition.continuous = true
            recognition.interimResults = true
        
            recognition.onstart = function () {
                console.log('recognition.onstart')
                state.started = true
            }
            recognition.onerror = function (event) {
                console.error(event.error)
                state.finished = true
            }
            recognition.onend = function () {
                console.log('recognition.onend')
                state.finished = true
            }
            recognition.onresult = function (event) {
                console.log('recognition.onresult')
                console.log(event.results)
                state.results = event.results
            }

            recognition.start()
        });

        cy.wrap(state).should('have.property', 'started', true)
        cy.get('.speech').click();
        cy.wrap(state, { timeout: 10000 }).should('have.property', 'finished', true)
    });
});