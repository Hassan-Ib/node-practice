# Server side programming (Backend)

## Node and its basic method

### fs (fileSystem) to read files from system

```javascript
   const fs = require('fs);
```

fs has both synchronious method and asynchronious methods

sync fs

```javascript
const { writeFileSync, readFileSync } = require('fs');
```

readFileSync takes file path and file encoding type as parameters and returns a string

```javascript
const file = readFileSync(filepath, 'utf8');
```

writeFileSync takes
async fs

```javascript
const { writeFile, readFile } = require('fs');
```
