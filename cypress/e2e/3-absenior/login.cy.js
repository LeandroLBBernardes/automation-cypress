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

    it('Deve navegar pra tela de esqueceu a senha', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('a').contains('Esqueci minha senha').click();

        cy.location('pathname').should('include', 'emailresetpassword');
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

    it('Deve retornar erro ao tentar logar com email e senha em brancos', () => {
        cy.get('button').contains('Entrar').click();
        
        cy.intercept('POST', '**/token?grant_type=password', { statusCode: 400 }).as('postSigin');
        cy.get('button').contains('Confirmar').click();
        cy.wait('@postSigin').its('response.statusCode').should('eq',400);

        cy.get('#swal2-title').should('have.text','Erro ao logar!');
        cy.get('#swal2-html-container').should('have.text','Email ou senha incorreta');
    });

    it('Deve retornar erro ao tentar logar com senha em branco', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('#email').type('teste@gmail.com');
        
        cy.intercept('POST', '**/token?grant_type=password', { statusCode: 400 }).as('postSigin');
        cy.get('button').contains('Confirmar').click();
        cy.wait('@postSigin').its('response.statusCode').should('eq',400);

        cy.get('#swal2-title').should('have.text','Erro ao logar!');
        cy.get('#swal2-html-container').should('have.text','Email ou senha incorreta');
    });

    it('Deve retornar erro ao tentar logar com email em branco', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('#password').type('123456');
        
        cy.intercept('POST', '**/token?grant_type=password', { statusCode: 400 }).as('postSigin');
        cy.get('button').contains('Confirmar').click();
        cy.wait('@postSigin').its('response.statusCode').should('eq',400);

        cy.get('#swal2-title').should('have.text','Erro ao logar!');
        cy.get('#swal2-html-container').should('have.text','Email ou senha incorreta');
    });

    it('Deve retornar erro ao tentar logar com email ou senha incorreta', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('#email').type('teste@gmail.com');
        cy.get('#password').type('123456');
        
        cy.intercept('POST', '**/token?grant_type=password', { statusCode: 400 }).as('postSigin');
        cy.get('button').contains('Confirmar').click();
        cy.wait('@postSigin').its('response.statusCode').should('eq',400);

        cy.get('#swal2-title').should('have.text','Erro ao logar!');
        cy.get('#swal2-html-container').should('have.text','Email ou senha incorreta');
    });

    it('Deve realizar o login corretamente', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('#email').type('usuarioteste.absenior@outlook.com');
        cy.get('#password').type('teste@1234');
        cy.get('button').contains('Confirmar').click();

        cy.location('pathname').should('include', 'home');
    });

    it('Deve deslogar caso o usuário deseje', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('#email').type('usuarioteste.absenior@outlook.com');
        cy.get('#password').type('teste@1234');
        cy.get('button').contains('Confirmar').click();

        cy.get('#Sair').click();

        cy.get('#swal2-title').should('have.text','Você tem certeza disso?');
        cy.get('button').contains('Sim, quero deslogar!').click();
        cy.location('pathname').should('include', '/');
    });

    it('Deve permanecer logado caso o usuário deseje', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('#email').type('usuarioteste.absenior@outlook.com');
        cy.get('#password').type('teste@1234');
        cy.get('button').contains('Confirmar').click();

        cy.get('#Sair').click();

        cy.get('#swal2-title').should('have.text','Você tem certeza disso?');
        cy.get('button').contains('Não, não quero deslogar!').click();
        cy.location('pathname').should('include', 'home');
    });
});