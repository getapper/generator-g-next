# Validazione Yup per API Generator CLI

Il generator API utilizza **Yup** per fornire una validazione robusta e dettagliata dei parametri CLI.

## Schema di Validazione

### Route Path (`route`)
```javascript
yup.string()
  .required("Route path is required")
  .min(1, "Route path cannot be empty")
  .matches(/^[a-zA-Z0-9\/\{\}\-]+$/, "Route path contains invalid characters...")
  .test("valid-route-format", "Route path format is invalid", function(value) {
    // Validazione personalizzata per parametri dinamici
  })
```

**Regole di validazione:**
- ✅ **Obbligatorio**: Non può essere vuoto
- ✅ **Caratteri ammessi**: Lettere, numeri, slash (`/`), parentesi graffe (`{}`), trattini (`-`)
- ✅ **Parametri dinamici**: Formato `{paramName}` dove:
  - `paramName` non può essere vuoto
  - Deve iniziare con una lettera
  - Può contenere solo lettere e numeri

**Esempi validi:**
- `users`
- `users/{userId}`
- `posts/{postId}/comments/{commentId}`
- `admin/users`

**Esempi non validi:**
- `users@#$` (caratteri speciali)
- `users/{}` (parametro vuoto)
- `users/{123invalid}` (parametro che inizia con numero)
- `` (stringa vuota)

### HTTP Method (`method`)
```javascript
yup.string()
  .required("HTTP method is required")
  .oneOf(Object.values(HttpMethods), "HTTP method must be one of: get, post, put, patch, delete")
```

**Regole di validazione:**
- ✅ **Obbligatorio**: Deve essere specificato
- ✅ **Valori supportati**: `get`, `post`, `put`, `patch`, `delete`
- ✅ **Case insensitive**: `GET`, `Post`, `PUT` sono accettati

### Cookie Authentication (`useCookieAuth` + `cookieRole`)
```javascript
useCookieAuth: yup.boolean().default(false),
cookieRole: yup.string()
  .when('useCookieAuth', {
    is: true,
    then: (schema) => schema
      .required("Cookie role is required...")
      .min(1, "Cookie role cannot be empty")
      .oneOf(availableCookieRoles, "Cookie role must be one of: admin, user, moderator"),
    otherwise: (schema) => schema.nullable()
  })
```

**Regole di validazione:**
- ✅ **Condizionale**: Se `useCookieAuth` è `true`, `cookieRole` diventa obbligatorio
- ✅ **Non vuoto**: Il ruolo cookie non può essere vuoto quando richiesto
- ✅ **Valori ammessi**: Solo i ruoli cookie definiti nel sistema (letti dinamicamente da `.genyg.json`)
- ✅ **Opzionale**: Se `useCookieAuth` è `false`, `cookieRole` può essere `null`

## Messaggi di Errore

### Errori di Route
```
• route: Route path is required
• route: Route path cannot be empty
• route: Route path contains invalid characters. Only letters, numbers, slashes, curly braces, and hyphens are allowed
• route: Parameter name cannot be empty inside curly braces
• route: Parameter name '123invalid' must start with a letter and contain only letters and numbers
```

### Errori di Metodo HTTP
```
• method: HTTP method is required
• method: HTTP method must be one of: get, post, put, patch, delete
```

### Errori di Autenticazione Cookie
```
• cookieRole: Cookie role is required when using cookie authentication
• cookieRole: Cookie role cannot be empty
• cookieRole: Cookie role must be one of: admin, user, moderator
```

## Esempi di Utilizzo

### Validazione Riuscita
```bash
yo g-next:api users/{userId} put --useCookieAuth --cookieRole admin
# ✅ Tutti i parametri sono validi
```

### Validazione Fallita - Errori Multipli
```bash
yo g-next:api users@#$ invalid --useCookieAuth --cookieRole superadmin
# ❌ Errori:
#   • method: HTTP method must be one of: get, post, put, patch, delete
#   • route: Route path contains invalid characters...
#   • cookieRole: Cookie role must be one of: admin, user, moderator
```

### Validazione Fallita - Parametro Dinamico
```bash
yo g-next:api users/{} get
# ❌ Errore:
#   • route: Parameter name cannot be empty inside curly braces
```

## Test della Validazione

### Eseguire i Test
```bash
# Test completo della validazione Yup
npm run test:yup-validation

# Test completo del generator API CLI
npm run test:api-cli
```

### Test Cases Inclusi
- ✅ Route valide (base, con parametri, multipli parametri)
- ✅ Metodi HTTP validi
- ✅ Autenticazione cookie valida
- ❌ Route con caratteri non validi
- ❌ Parametri dinamici malformati
- ❌ Metodi HTTP non supportati
- ❌ Autenticazione cookie incompleta

## Vantaggi della Validazione Yup

1. **Validazione Robusta**: Controlli approfonditi su tutti i parametri
2. **Messaggi Chiari**: Errori dettagliati e comprensibili
3. **Validazione Condizionale**: Regole che dipendono da altri campi
4. **Validazione Personalizzata**: Test custom per casi specifici
5. **Validazione Multipla**: Tutti gli errori vengono mostrati insieme
6. **Type Safety**: Validazione dei tipi di dati
7. **Performance**: Validazione efficiente e veloce

## Integrazione con Yeoman

La validazione Yup è integrata nel ciclo di vita del generator Yeoman:

1. **Parsing CLI**: I parametri vengono estratti da `this.args` e `this.options`
2. **Validazione**: Lo schema Yup valida tutti i parametri
3. **Gestione Errori**: Gli errori vengono mostrati in modo user-friendly
4. **Continuazione**: Se la validazione passa, il generator procede con la generazione

Questa implementazione garantisce che l'API venga generata solo con parametri validi, migliorando l'affidabilità e l'usabilità del tool.
