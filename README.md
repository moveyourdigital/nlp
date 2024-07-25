# nlp
NLP (natural language processing) for server and the browser in TypeScript. All lightweight and super-fast.

### Installation
```
npm i @moveyourdigital/nlp
```

### Basic Usage
This is a minimal usage of the Naive Bayes classifier.

```typescript
import { BayesClassifier, Tokenizer, WordsEnTokenizer } from '@moveyourdigital/nlp'

const tokenizer = new WordsEnTokenizer()

const classifier = new BayesClassifier<string, string>()
  .set('smoothing', 0.1)
  .addDocument({
    observation: tokenizer.tokenize(
      'you are a beautiful person'
    ),
    label: 'good',
  })
  .addDocument({
    observation: tokenizer.tokenize(
      'he is an evil person'
    ),
    label: 'bad',
  })
  .train()

const classification = classifier.classify(
  tokenizer.tokenize('i am a beautiful person')
)
```
Classification should output
```js
[
  { label: 'good', score: 4.6305 }, // ordered by highiest score
  { label: 'bad', score: 1.2705000000000002 }
]
```

### Serialize / Deserialize
The classifier can be serialized to JSON. There's also a "compile" version where _corpus_ is stripped from the serialization output.

```js
classifier.toJSON({
  compact: true
}) // JSON string representation. Optional "compact" to strip documents and reduce size.
```

To restore back for more training you should not use the `compact` flag.
```js
const json = classifier.toJSON()
classifier.restore(json) // stringified or already parsed
```

### Development
To watch for changes in `src` directory.
```bash
npm start
```
To bundle for production
```bash
npm run build
```
Unit tests are located in
```bash
npm t
```
