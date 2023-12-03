/// <reference types="cypress" />

context('Register', () => {
    beforeEach(() => {
        cy.visit('https://absenior.vercel.app');
    });

    it('Deve entrar na tela de cadastro a partir do início', () => {
        cy.get('button').contains('Cadastrar').click();

        cy.location('pathname').should('include', 'register');
    });

    it('Deve entrar na tela de cadastro pelo login', () => {
        cy.get('button').contains('Entrar').click();
        cy.get('a').contains('Cadastrar').click();

        cy.location('pathname').should('include', 'register');
    });

    it('Deve sair som ao clicar no botão de microfone', () => {
        const state = {
            started: false,
            finished: false,
        }
    
        cy.visit('https://absenior.vercel.app/register').then(() => {
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

    it('Deve apresentar erro ao tentar cadastrar senha com menos de 6 caracteres', () => {
        cy.get('button').contains('Cadastrar').click();
        cy.get('#name').type('Teste');
        cy.get('#email').type('teste@gmail.com');
        cy.get('#password').type('12345');
        
        cy.intercept('POST', '**/signup', { statusCode: 400 }).as('postSignup');
        cy.get('button').contains('Confirmar').click();
        cy.wait('@postSignup').its('response.statusCode').should('eq',400);

        cy.get('#swal2-title').should('have.text','Erro ao cadastrar!');
        cy.get('#swal2-html-container').should('have.text','A senha deve possuir mais que 6 caracteres');
    });

    it('Deve apresentar erro caso usuário já esteja cadastrado', () => {
        cy.get('button').contains('Cadastrar').click();
        cy.get('#name').type('Teste');
        cy.get('#email').type('leandro.l.bernardes@gmail.com');
        cy.get('#password').type('123456');

        cy.intercept('POST', '**/signup', { statusCode: 400 }).as('postSignup');
        cy.get('button').contains('Confirmar').click();
        cy.wait('@postSignup').its('response.statusCode').should('eq',400);

        cy.get('#swal2-title').should('have.text','Erro ao cadastrar!');
        cy.get('#swal2-html-container').should('have.text','Usuário já cadastrado');
    });

    it('Deve apresentar erro caso o nome do usuário esteja vazio', () => {
        cy.get('button').contains('Cadastrar').click();
        cy.get('#email').type('teste@gmail.com');
        cy.get('#password').type('123456');
        cy.get('button').contains('Confirmar').click();
        
        cy.get('#swal2-title').should('have.text','Erro ao cadastrar!');
        cy.get('#swal2-html-container').should('have.text','O nome não pode estar vazio!');
    });

    it('Deve realizar o cadastro corretamente', () => {
        cy.get('button').contains('Cadastrar').click();
        cy.get('#name').type('Teste');
        cy.get('#email').type('teste1@outlook.com');
        cy.get('#password').type('123456');

        cy.intercept('POST', '**/signup', { 
            statusCode: 200,
            body: {
                user: {
                    id: "1bbf544c-8f58-4250-a247-75128effac88",
                    aud: "authenticated",
                    role: "authenticated",
                    email: "teste1@outlook.com",
                    email_confirmed_at: "2023-12-03T15:44:44.409264703Z",
                    phone: "",
                    last_sign_in_at: "2023-12-03T15:44:44.411659304Z",
                    app_metadata: {
                        provider: "email",
                        providers: [
                            "email"
                        ]
                    },
                    user_metadata: {},
                    identities: [
                        {
                            id: "1bbf544c-8f58-4250-a247-75128effac88",
                            user_id: "1bbf544c-8f58-4250-a247-75128effac88",
                            identity_data: {
                                "email": "teste1@outlook.com",
                                "email_verified": false,
                                "phone_verified": false,
                                "sub": "1bbf544c-8f58-4250-a247-75128effac88"
                            },
                            provider: "email",
                            last_sign_in_at: "2023-12-03T15:44:44.408090041Z",
                            created_at: "2023-12-03T15:44:44.408138Z",
                            updated_at: "2023-12-03T15:44:44.408138Z"
                        }
                    ],
                    created_at: "2023-12-03T15:44:44.405871Z",
                    updated_at: "2023-12-03T15:44:44.413231Z"
                }
            }
        }).as('postSignup');

        cy.intercept('POST','**/usuarios?columns=%22idUsuario%22%2C%22nome%22%2C%22email%22', {statusCode: 200}).as('postUsers');

        cy.get('button').contains('Confirmar').click();
        cy.wait('@postSignup').its('response.statusCode').should('eq',200);
        cy.wait('@postUsers').its('response.statusCode').should('eq',200);

        cy.get('#swal2-title').should('have.text','Sucesso');
        cy.get('#swal2-html-container').should('have.text','Seu cadastro foi realizado com sucesso');
        cy.location('pathname').should('include', 'home');
    });
});