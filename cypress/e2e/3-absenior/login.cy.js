/// <reference types="cypress" />

context('Login', () => {
    beforeEach(() => {
        cy.visit('https://absenior.vercel.app');
    });

    it('Deve entrar na tela de login a partir do início', () => {
        cy.get('button').contains('Entrar').click();

        cy.location('pathname').should('include', 'login');
    });

    it('Deve entrar na tela de login pelo cadastro', () => {
        cy.get('button').contains('Cadastrar').click();
        cy.get('a').contains('Entrar').click();

        cy.location('pathname').should('include', 'login');
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