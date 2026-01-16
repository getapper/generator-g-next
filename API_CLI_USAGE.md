# API Generator CLI Usage

Il generator API ora supporta l'utilizzo tramite parametri della linea di comando, permettendo la generazione senza interazione manuale.

## Sintassi

```bash
yo g-next:api --route <route> --method <method> [options]
```

## Opzioni

### Opzioni obbligatorie
- `--route`: Il percorso dell'API (es. `users`, `users/{userId}`, `posts/{postId}/comments`)
- `--method`: Il metodo HTTP (`get`, `post`, `put`, `patch`, `delete`)

### Opzioni opzionali
- `--useCookieAuth`: Abilita l'autenticazione tramite cookie (boolean)
- `--cookieRole`: Specifica il ruolo per l'autenticazione cookie (string)

## Esempi di utilizzo

### Generazione base
```bash
# Genera un endpoint GET per /users
yo g-next:api --route users --method get

# Genera un endpoint POST per /posts
yo g-next:api --route posts --method post

# Genera un endpoint PUT per /users/{userId}
yo g-next:api --route users/{userId} --method put
```

### Con autenticazione cookie
```bash
# Genera un endpoint GET per /admin/users con autenticazione cookie
yo g-next:api --route admin/users --method get --useCookieAuth --cookieRole admin

# Genera un endpoint POST per /posts con autenticazione cookie
yo g-next:api --route posts --method post --useCookieAuth --cookieRole user
```

### Esempi con parametri dinamici
```bash
# Endpoint con singolo parametro
yo g-next:api --route users/{userId} --method get

# Endpoint con parametri multipli
yo g-next:api --route posts/{postId}/comments/{commentId} --method get

# Endpoint con parametri e autenticazione
yo g-next:api --route admin/users/{userId} --method put --useCookieAuth --cookieRole admin
```

## Modalità interattiva vs CLI

- **Modalità CLI**: Quando vengono fornite le opzioni `--route` e `--method`, il generator salta i prompt e utilizza i valori forniti. In questa modalità, **tutti i file esistenti vengono sovrascritti automaticamente** senza chiedere conferma.
- **Modalità interattiva**: Quando le opzioni non vengono fornite, il generator mostra i prompt per l'inserimento manuale. In questa modalità, Yeoman chiederà conferma prima di sovrascrivere file esistenti.

## Gestione Automatica dei Conflitti

Quando vengono forniti parametri CLI (modalità non interattiva), il generator **accetta automaticamente tutte le modifiche ai file** senza chiedere conferma. Questo comportamento è ideale per script automatizzati e pipeline CI/CD dove non è possibile interagire con i prompt.

**Esempio:**
```bash
# Modalità CLI: accetta automaticamente tutte le modifiche
yo g-next:api --route users --method get

# Modalità interattiva: chiederà conferma se un file esiste già
yo g-next:api
```

**Nota:** In modalità CLI, tutti i file esistenti verranno sovrascritti automaticamente. Usare con cautela in produzione.

## Validazione

Il generator utilizza **Yup** per la validazione robusta dei parametri CLI:

### Validazione Route
- **Obbligatorio**: Il percorso dell'API non può essere vuoto
- **Formato**: Solo lettere, numeri, slash, parentesi graffe e trattini sono ammessi
- **Parametri dinamici**: Devono seguire il formato `{paramName}` dove:
  - `paramName` non può essere vuoto
  - Deve iniziare con una lettera
  - Può contenere solo lettere e numeri
- **Esempi validi**: `users`, `users/{userId}`, `posts/{postId}/comments/{commentId}`
- **Esempi non validi**: `users@#$`, `users/{}`, `users/{123invalid}`

### Validazione Metodo HTTP
- **Obbligatorio**: Il metodo HTTP deve essere specificato
- **Valori supportati**: `get`, `post`, `put`, `patch`, `delete`
- **Case insensitive**: `GET`, `Post`, `PUT` sono accettati e convertiti automaticamente

### Validazione Autenticazione Cookie
- **Condizionale**: Se `--useCookieAuth` è `true`, `--cookieRole` diventa obbligatorio
- **Formato**: Il ruolo cookie non può essere vuoto quando richiesto
- **Valori ammessi**: Solo i ruoli cookie definiti nel sistema (es. `admin`, `user`, `moderator`)
- **Validazione dinamica**: I ruoli disponibili vengono letti dal file di configurazione `.genyg.json`

### Messaggi di Errore
La validazione Yup fornisce messaggi di errore dettagliati:
```
Validation errors found:
  • method: HTTP method must be one of: get, post, put, patch, delete
  • route: Parameter name '123invalid' must start with a letter and contain only letters and numbers
  • cookieRole: Cookie role must be one of: admin, user, moderator
```

## File generati

Il generator crea i seguenti file:
- `src/pages/api/[route]/index.ts` - Endpoint API
- `src/endpoints/[method]-[route]/` - Cartella con:
  - `interfaces.ts` - Interfacce TypeScript
  - `validations.ts` - Validazioni Yup
  - `handler.ts` - Logica dell'handler
  - `index.test.ts` - Test unitari
  - `index.ts` - File principale dell'endpoint
