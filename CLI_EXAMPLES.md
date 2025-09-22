# API Generator CLI - Esempi Pratici

Questo documento fornisce esempi pratici di utilizzo del generator API con parametri CLI.

## Esempi Base

### 1. Endpoint GET semplice
```bash
yo g-next:api --route users --method get
```
**Risultato**: Crea un endpoint GET per `/users`

### 2. Endpoint POST per creazione
```bash
yo g-next:api --route posts --method post
```
**Risultato**: Crea un endpoint POST per `/posts`

### 3. Endpoint PUT per aggiornamento
```bash
yo g-next:api --route users/{userId} --method put
```
**Risultato**: Crea un endpoint PUT per `/users/{userId}`

### 4. Endpoint PATCH per aggiornamento parziale
```bash
yo g-next:api --route posts/{postId} --method patch
```
**Risultato**: Crea un endpoint PATCH per `/posts/{postId}`

### 5. Endpoint DELETE per eliminazione
```bash
yo g-next:api --route comments/{commentId} --method delete
```
**Risultato**: Crea un endpoint DELETE per `/comments/{commentId}`

## Esempi con Parametri Dinamici

### 6. Endpoint con parametro singolo
```bash
yo g-next:api users/{userId} get
```
**Risultato**: Crea un endpoint GET per `/users/{userId}`

### 7. Endpoint con parametri multipli
```bash
yo g-next:api posts/{postId}/comments/{commentId} get
```
**Risultato**: Crea un endpoint GET per `/posts/{postId}/comments/{commentId}`

### 8. Endpoint con parametri e metodo POST
```bash
yo g-next:api users/{userId}/posts post
```
**Risultato**: Crea un endpoint POST per `/users/{userId}/posts`

## Esempi con Autenticazione Cookie

### 9. Endpoint admin con autenticazione
```bash
yo g-next:api admin/users get --useCookieAuth --cookieRole admin
```
**Risultato**: Crea un endpoint GET per `/admin/users` con autenticazione cookie per ruolo admin

### 10. Endpoint utente con autenticazione
```bash
yo g-next:api profile put --useCookieAuth --cookieRole user
```
**Risultato**: Crea un endpoint PUT per `/profile` con autenticazione cookie per ruolo user

### 11. Endpoint con parametri e autenticazione
```bash
yo g-next:api admin/users/{userId} put --useCookieAuth --cookieRole admin
```
**Risultato**: Crea un endpoint PUT per `/admin/users/{userId}` con autenticazione cookie per ruolo admin

## Esempi di Utilizzo in Script

### 12. Script di automazione
```bash
#!/bin/bash
# Script per creare multiple API endpoints

echo "Creating user management APIs..."

yo g-next:api --route users --method get
yo g-next:api users post
yo g-next:api users/{userId} get
yo g-next:api --route users/{userId} --method put
yo g-next:api users/{userId} delete

echo "Creating post management APIs..."

yo g-next:api posts get
yo g-next:api --route posts --method post
yo g-next:api posts/{postId} get
yo g-next:api posts/{postId} put
yo g-next:api posts/{postId} delete

echo "Creating comment APIs..."

yo g-next:api posts/{postId}/comments get
yo g-next:api posts/{postId}/comments post
yo g-next:api comments/{commentId} put
yo g-next:api --route comments/{commentId} --method delete

echo "All APIs created successfully!"
```

### 13. Script con autenticazione
```bash
#!/bin/bash
# Script per creare API con autenticazione

echo "Creating authenticated APIs..."

# Admin APIs
yo g-next:api admin/users get --useCookieAuth --cookieRole admin
yo g-next:api admin/users post --useCookieAuth --cookieRole admin
yo g-next:api admin/users/{userId} put --useCookieAuth --cookieRole admin
yo g-next:api admin/users/{userId} delete --useCookieAuth --cookieRole admin

# User APIs
yo g-next:api profile get --useCookieAuth --cookieRole user
yo g-next:api profile put --useCookieAuth --cookieRole user

echo "Authenticated APIs created successfully!"
```

## Esempi di Validazione Yup

### 14. Test di validazione metodo HTTP
```bash
yo g-next:api users invalid
```
**Risultato**: Mostra errore Yup "HTTP method must be one of: get, post, put, patch, delete"

### 15. Test di validazione autenticazione
```bash
yo g-next:api --route users --method get --useCookieAuth
```
**Risultato**: Mostra errore Yup "Cookie role is required when using cookie authentication"

### 16. Test di validazione formato route
```bash
yo g-next:api users@#$ get
```
**Risultato**: Mostra errore Yup "Route path contains invalid characters. Only letters, numbers, slashes, curly braces, and hyphens are allowed"

### 17. Test di validazione parametri dinamici
```bash
yo g-next:api users/{} get
```
**Risultato**: Mostra errore Yup "Parameter name cannot be empty inside curly braces"

### 18. Test di validazione nome parametro
```bash
yo g-next:api users/{123invalid} get
```
**Risultato**: Mostra errore Yup "Parameter name '123invalid' must start with a letter and contain only letters and numbers"

### 19. Test di validazione route vuoto
```bash
yo g-next:api "" get
```
**Risultato**: Mostra errore Yup "Route path cannot be empty"

### 20. Test di validazione ruolo cookie non valido
```bash
yo g-next:api --route users --method get --useCookieAuth --cookieRole superadmin
```
**Risultato**: Mostra errore Yup "Cookie role must be one of: admin, user, moderator"

### 21. Test di validazione multipla
```bash
yo g-next:api users@#$ invalid --useCookieAuth --cookieRole guest
```
**Risultato**: Mostra errori Yup multipli:
```
Validation errors found:
  • method: HTTP method must be one of: get, post, put, patch, delete
  • route: Route path contains invalid characters. Only letters, numbers, slashes, curly braces, and hyphens are allowed
  • cookieRole: Cookie role must be one of: admin, user, moderator
```

## File Generati

Ogni comando genera i seguenti file:

```
src/
├── pages/
│   └── api/
│       └── [route]/
│           └── index.ts          # Endpoint API Next.js
└── endpoints/
    └── [method]-[route]/
        ├── interfaces.ts         # Interfacce TypeScript
        ├── validations.ts        # Validazioni Yup
        ├── handler.ts            # Logica dell'handler
        ├── index.test.ts         # Test unitari
        └── index.ts              # File principale
```

## Note Importanti

1. **Parametri dinamici**: Usa la sintassi `{paramName}` per parametri singoli
2. **Metodi HTTP**: Sono supportati solo `get`, `post`, `put`, `patch`, `delete`
3. **Autenticazione**: Se usi `--useCookieAuth`, devi specificare anche `--cookieRole`
4. **Validazione**: Il generator valida automaticamente tutti i parametri
5. **Modalità mista**: Puoi usare sia CLI che modalità interattiva nello stesso progetto
