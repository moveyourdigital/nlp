import assert from 'node:assert'
import { BayesClassifier, WordsEnTokenizer } from './index.js'
import { describe, test } from 'node:test'

describe('bayes classification', () => {
  describe('using vectors of numbers', () => {
    const classifier = new BayesClassifier<number, string>()
      .addDocument({
        observation: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        label: 'even',
      })
      .addDocument({
        observation: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
        label: 'odd',
      })
      .train()

    test('should match odd label', () => {
      const classification = classifier.classify([
        2, 3, 5, 8, 9, 11, 13
      ])

      assert.equal(classification[0].label, 'odd')
      assert(classification[0].score > classification[1].score)
    })
  })

  describe('using vectors of strings', () => {
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

    test('should match good label', () => {
      const classification = classifier.classify(
        tokenizer.tokenize('i am a beautiful person')
      )

      assert.equal(classification[0].label, 'good')
      assert(classification[0].score > classification[1].score)
    })
  })

  describe('serializing / restoring', () => {
    const model = new BayesClassifier<string, string>()
      .set('smoothing', 0.1)
      .addDocument({
        observation: ['one', 'two', 'three', 'four'],
        label: 'numbers',
      })
      .addDocument({
        observation: ['water', 'earth', 'fire', 'wind'],
        label: 'elements',
      })
      .train()
      .toJSON({ compact: true })

    test('should match good label', () => {
      const classifier = new BayesClassifier<string, string>()
        .restore(model)

      const classification = classifier.classify(
        ['one', 'water', 'one', 'fire', 'earth']
      )

      assert.equal(classifier.get('smoothing'), 0.1)
      assert.deepStrictEqual(classifier.stats, { labels: { numbers: 1, elements: 1 }, corpus: 2 })
      assert.equal(classification[0].label, 'elements')
    })
  })
})
