# nlp
Natural Language Processing (NLP) written in TypeScript for both server and browser environments. Lightweight and ultra-fast.

### Introduction

The goal of this package is to provide a lightweight and super-fast solution for natural language processing tasks.

It aims to be the go-to choice for developers seeking a powerful yet easy-to-use NLP solution in TypeScript. Whether working on the server-side or in the browser, this is optimized for performance and simplicity.

This package was inspired in the good but old [`apparatus`](https://www.npmjs.com/package/apparatus) package.

### Key Features:
#### Naive Bayes Classifier (`BayesClassifier` class)
- A simple and effective classifier based on Bayes' theorem, ideal for text classification tasks.
- Supports serialization to JSON for easy model saving and sharing.
- Includes a compiled version where the corpus is stripped from the serialization output, reducing the model size for distribution when used solely for text classification (i.e., no further training).

#### RegexpTokenizer
- A versatile tokenizer with current support for English and Portuguese. This tool efficiently splits text into meaningful tokens using regular expressions.

#### Normalizer
- This feature allows for text normalization, accepting a stemmer and a list of stopwords. It integrates seamlessly with the `natural` npm package for stemming and the `stopword` npm package for managing stopword lists.

### Installation
```
npm i @moveyourdigital/nlp
```

### Basic Usage
This is a minimal usage of the Naive Bayes classifier using sentences.

```typescript
import { BayesClassifier, Tokenizer, WordsEnTokenizer } from '@moveyourdigital/nlp'

const tokenizer = new WordsEnTokenizer()
// or WordsPtTokenizer

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
The classifier supports flexible serialization and deserialization, making it easy to save, share, and deploy trained models.

#### Standard Serialization
One can serialize the classifier to a JSON string, enabling to store or transfer the model. This is especially useful for deploying models to different environments or saving the state of a model for future use.

```js
const jsonString = classifier.toJSON();
// Standard JSON string representation of the model
```

#### Compact Serialization
For scenarios where the model is only needed for text classification (i.e., no further training is required), you can use the compact serialization option. This removes the corpus from the serialization output, significantly reducing the model's size for efficient distribution.

```js
const jsonString = classifier.toJSON({ compact: true });
// JSON string representation of the model for distribution
```

#### Deserialization
To restore the model for further training or usage, deserialize the JSON string back into the classifier. If you intend to continue training the model, do not use the compact flag during serialization.

```js
classifier.restore(jsonString); // Accepts both stringified or already parsed JSON
```

This flexible serialization and deserialization process ensures that NLP models can be managed efficiently, whether a lightweight distribution is needed or the full model for ongoing development.


### Roadmap for further development
* Porter stemming
* Lemmatization
* TF-IDF (using BM25 extension)
* Support for new languages (help appreciated)

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
