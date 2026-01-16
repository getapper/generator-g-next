# Tutti i Generator con CLI e Validazione Yup

Tutti i generatori principali ora supportano l'utilizzo tramite parametri della linea di comando e la validazione robusta con Yup.

## Generator API

**Comando:** `yo g-next:api --route <route> --method <method> [options]`

**Opzioni:**
- `--route` (obbligatorio): Percorso dell'API (es. `users`, `users/{userId}`)
- `--method` (obbligatorio): Metodo HTTP (`get`, `post`, `put`, `patch`, `delete`)
- `--useCookieAuth`: Abilita autenticazione cookie
- `--cookieRole`: Ruolo per autenticazione cookie

**Esempi:**
```bash
yo g-next:api --route users --method get
yo g-next:api --route users/{userId} --method put --useCookieAuth --cookieRole admin
```

## Generator AJAX

**Comando:** `yo g-next:ajax --route <route> --method <method> [options]`

**Opzioni:**
- `--route` (obbligatorio): Percorso dell'API
- `--method` (obbligatorio): Metodo HTTP
- `--spaFolderName`: Nome della cartella SPA

**Esempi:**
```bash
yo g-next:ajax --route users --method get
yo g-next:ajax --route posts/{postId} --method post --spaFolderName main
```

## Generator Component

**Comando:** `yo g-next:comp --componentName <componentName> [options]`

**Opzioni:**
- `--componentName` (obbligatorio): Nome del componente
- `--componentPath`: Percorso del componente (relativo a src/components)

**Esempi:**
```bash
yo g-next:comp --componentName UserCard
yo g-next:comp --componentName UserProfile --componentPath user
```

## Generator Form

**Comando:** `yo g-next:form --formName <formName> [options]`

**Opzioni:**
- `--formName` (obbligatorio): Nome del form
- `--formPath`: Percorso del form (relativo a src/components)

**Esempi:**
```bash
yo g-next:form --formName LoginForm
yo g-next:form --formName UserRegistration --formPath auth
```

## Generator Model

**Comando:** `yo g-next:model --modelName <modelName> --location <location> [options]`

**Opzioni:**
- `--modelName` (obbligatorio): Nome del modello
- `--location` (obbligatorio): Posizione (`client`, `server`, `common`)

**Esempi:**
```bash
yo g-next:model --modelName User --location client
yo g-next:model --modelName Product --location server
yo g-next:model --modelName ApiResponse --location common
```

## Generator Page

**Comando:** `yo g-next:page --pageName <pageName> --componentName <componentName> --renderingStrategy <renderingStrategy> [options]`

**Opzioni:**
- `--pageName` (obbligatorio): Nome della pagina (es. `users`, `[userId]`, `[[...params]]`)
- `--componentName` (obbligatorio): Nome del componente pagina
- `--renderingStrategy` (obbligatorio): Strategia di rendering (`none`, `Static Generation Props (SSG)`, `Server-side Rendering Props (SSR)`)
- `--pagePath`: Percorso della pagina (relativo a src/pages)
- `--useCookieAuth`: Abilita autenticazione cookie
- `--cookieRole`: Ruolo per autenticazione cookie

**Esempi:**
```bash
yo g-next:page --pageName users --componentName UserList --renderingStrategy "Static Generation Props (SSG)"
yo g-next:page --pageName "[userId]" --componentName UserDetail --renderingStrategy "Server-side Rendering Props (SSR)" --useCookieAuth --cookieRole admin
```

## Generator Scene

**Comando:** `yo g-next:scene --sceneName <sceneName> [options]`

**Opzioni:**
- `--sceneName` (obbligatorio): Nome della scena
- `--spaFolderName`: Nome della cartella SPA

**Esempi:**
```bash
yo g-next:scene --sceneName HomePage
yo g-next:scene --sceneName UserDashboard --spaFolderName admin
```

## Generator Slice

**Comando:** `yo g-next:slice --sliceName <sliceName> [options]`

**Opzioni:**
- `--sliceName` (obbligatorio): Nome dello slice Redux
- `--spaFolderName`: Nome della cartella SPA
- `--useSagas`: Crea file saga (default: true)

**Esempi:**
```bash
yo g-next:slice --sliceName user
yo g-next:slice --sliceName products --spaFolderName main --useSagas false
```

## Generator Task

**Comando:** `yo g-next:task --taskName <taskName> [options]`

**Opzioni:**
- `--taskName` (obbligatorio): Nome del task

**Esempi:**
```bash
yo g-next:task --taskName SendEmails
yo g-next:task --taskName ProcessData
```

## Generator Model MongoDB

**Comando:** `yo g-next:model-mongodb --modelName <modelName> [options]`

**Opzioni:**
- `--modelName` (obbligatorio): Nome del modello MongoDB

**Esempi:**
```bash
yo g-next:model-mongodb --modelName User
yo g-next:model-mongodb --modelName Product
```

## Generator SPA

**Comando:** `yo g-next:spa --spaName <spaName> --pageName <pageName> [options]`

**Opzioni:**
- `--spaName` (obbligatorio): Nome della SPA
- `--pageName` (obbligatorio): Nome della pagina
- `--pagePath`: Percorso della pagina (relativo a src/pages)

**Esempi:**
```bash
yo g-next:spa --spaName AdminApp --pageName AdminDashboard
yo g-next:spa --spaName UserApp --pageName UserProfile --pagePath user
```

## Validazione Yup

Tutti i generatori utilizzano **Yup** per la validazione robusta dei parametri CLI:

### Validazioni Comuni

- **Nomi**: Devono iniziare con una lettera e contenere solo lettere e numeri
- **Route API**: Solo lettere, numeri, slash, parentesi graffe e trattini
- **Parametri dinamici**: Formato `{paramName}` con validazione del nome
- **Metodi HTTP**: Solo valori supportati (`get`, `post`, `put`, `patch`, `delete`)
- **Ruoli Cookie**: Solo ruoli definiti nel sistema (letti da `.genyg.json`)
- **SPA**: Solo SPA disponibili nel progetto

### Messaggi di Errore

La validazione Yup fornisce messaggi di errore dettagliati:

```
Validation errors found:
  • componentName: Name must start with a letter and contain only letters and numbers
  • method: HTTP method must be one of: get, post, put, patch, delete
  • cookieRole: Cookie role must be one of: admin, user, moderator
```

## Modalità di Utilizzo

### Modalità CLI (Non Interattiva)
Quando vengono forniti i parametri obbligatori, il generator salta i prompt e utilizza i valori forniti.

### Modalità Interattiva
Quando i parametri non vengono forniti, il generator mostra i prompt per l'inserimento manuale.

### Gestione Automatica dei Conflitti
Quando vengono forniti parametri CLI (modalità non interattiva), il generator **accetta automaticamente tutte le modifiche ai file** senza chiedere conferma. Questo comportamento è ideale per script automatizzati e pipeline CI/CD dove non è possibile interagire con i prompt.

**Comportamento:**
- **Modalità CLI**: Tutti i file esistenti vengono sovrascritti automaticamente senza chiedere conferma
- **Modalità Interattiva**: Yeoman chiederà conferma prima di sovrascrivere file esistenti

**Esempio:**
```bash
# Modalità CLI: accetta automaticamente tutte le modifiche
yo g-next:api --route users --method get

# Modalità interattiva: chiederà conferma se un file esiste già
yo g-next:api
```

**Nota:** In modalità CLI, tutti i file esistenti verranno sovrascritti automaticamente. Usare con cautela in produzione.

## Vantaggi

1. **Automazione**: Possibilità di integrare la generazione in script e pipeline CI/CD
2. **Validazione Robusta**: Controlli approfonditi su tutti i parametri
3. **Messaggi Chiari**: Errori dettagliati e comprensibili
4. **Retrocompatibilità**: Mantiene il comportamento esistente per utenti che usano i prompt
5. **Consistenza**: Stessa interfaccia CLI per tutti i generatori
6. **Flessibilità**: Supporta sia modalità interattiva che non interattiva

## Esempi di Automazione

### Script di Setup Progetto
```bash
#!/bin/bash
# Setup completo di un progetto Next.js

# Core packages
yo g-next:pkg-core

# Models
yo g-next:model --modelName User --location client
yo g-next:model --modelName Product --location server
yo g-next:model --modelName ApiResponse --location common

# Pages
yo g-next:page --pageName home --componentName HomePage --renderingStrategy "Static Generation Props (SSG)"
yo g-next:page --pageName "[userId]" --componentName UserDetail --renderingStrategy "Server-side Rendering Props (SSR)" --useCookieAuth --cookieRole user

# Components
yo g-next:comp --componentName UserCard
yo g-next:comp --componentName UserProfile --componentPath user

# Forms
yo g-next:form --formName LoginForm --formPath auth
yo g-next:form --formName UserRegistration --formPath auth

# API Endpoints (modalità CLI: accetta automaticamente modifiche ai file)
yo g-next:api --route users --method get
yo g-next:api --route users/{userId} --method put --useCookieAuth --cookieRole admin
yo g-next:api --route products --method post --useCookieAuth --cookieRole admin

# Tasks
yo g-next:task --taskName SendEmails
yo g-next:task --taskName ProcessData

# MongoDB Models
yo g-next:model-mongodb --modelName User
yo g-next:model-mongodb --modelName Product

# SPAs
yo g-next:spa --spaName AdminApp --pageName AdminDashboard
yo g-next:spa --spaName UserApp --pageName UserProfile --pagePath user

echo "Project setup completed!"
```

### Pipeline CI/CD
```yaml
# .github/workflows/setup-project.yml
name: Setup Project
on: [push]
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Generate API endpoints
        run: |
          yo g-next:api --route users --method get
          yo g-next:api --route users/{userId} --method put --useCookieAuth --cookieRole admin
      - name: Generate components
        run: |
          yo g-next:comp --componentName UserCard
          yo g-next:comp --componentName UserProfile --componentPath user
```

Questa implementazione rende tutti i generatori molto più potenti e flessibili, permettendo sia l'uso interattivo che l'automazione completa tramite CLI.
