/*
Copyright (c) 2024 Move Your Digital, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { Classification, Classifier, Document, Label, ModelAsJSON, Observation, Stats } from "./classifier.js";

/**
 * Type representing a binary value, either 0 or 1.
 */
type Binary = 0 | 1

/**
 * Bayes classifier properties
 */
type Properties = {
  smoothing: number
}

/**
 * Class representing a Naive Bayes classifier.
 * @template T - Type extending Observation
 * @template K - Type extending Label
 * @extends {Classifier<T, K>}
 */
export class BayesClassifier<T extends Observation, K extends Label> extends Classifier<T, K> {
  /**
   * @private
   * @type {Partial<Record<T, number>>}
   */
  private features: Map<T, number> = new Map()

  /**
   * @private
   * @type {Partial<Record<K, number[]>>}
   */
  private matrix: Partial<Record<K, number[]>> = {}

  /**
   * @private
   * @type {Document<T, K>[]}
   */
  private corpus: Document<T, K>[] = []

  /**
   * @public
   * @type {Properties}
   */
  private properties: Properties = {
    smoothing: 1.0
  }

  /**
   * @private
   * @type {Stats<K>}
   */
  readonly stats: Stats<K> = {
    labels: {},
    corpus: 0,
  }

  /**
   * Sets a property of the classifier.
   * @param {keyof Properties} prop - The property to set.
   * @param {Properties[K]} value - The value to set.
   * @returns {this} The classifier instance.
   */
  set<K extends keyof Properties>(prop: K, value: Properties[K]): this {
    this.properties[prop] = value;
    return this;
  }

  /**
   * Gets a property of the classifier.
   * @param {keyof Properties} prop - The property to get.
   * @returns {Properties[K]} The value of property.
   */
  get<K extends keyof Properties>(prop: K): Properties[K] {
    return this.properties[prop];
  }

  /**
   * Classifies the given observation.
   * @param {Readonly<Document<T, K>['observation']>} observation - The observation to classify.
   * @returns {Classification<K>[]} An array of classification results.
   */
  classify(observation: Readonly<Document<T, K>['observation']>): Classification<K>[] {
    const vector = this.vectorize(observation)

    return Object.keys(this.matrix)
      .map((key) => {
        return ({
          label: key as K,
          score: this.probability(vector, key as K),
        })
      })
      .sort((a, b) => b.score - a.score)
  }

  /**
   * Adds a document to the classifier.
   * @param {Readonly<Document<T, K>>} document - The document to add.
   * @returns {this} The classifier instance.
   */
  addDocument({ label, observation }: Readonly<Document<T, K>>): this {
    if (observation.length === 0) return this;

    this.corpus.push({
      label,
      observation,
    });
    
    observation.forEach(
      (token) => this.features.set(
        token, 
        (this.features.get(token) || 0) + 1
      )
    );
    
    return this;
  }

  /**
   * Trains the classifier.
   * @returns {this}
   */
  train(): this {
    this.corpus
      .slice(this.stats?.corpus)
      .forEach(({ label, observation }) => {
        const vector = this.vectorize(observation);

        if (label in this.matrix) {
          vector.forEach((value, index) => {
            this.matrix[label]![index] =
            this.matrix[label]![index] + value;
          })
          
        } else {
          this.matrix[label] = vector.map((v) => v + 1 + this.properties.smoothing);
        }

        if (!(label in this.stats.labels)) {
          this.stats.labels[label] = 0;
        }

        this.stats.labels[label]!++;
        this.stats.corpus++;
      })

    return this
  }

  /**
   * Restores the classifier from a JSON model.
   * @param {ModelAsJSON} data - The model in JSON format.
   * @returns {this} The classifier instance.
   */
  restore(data: ModelAsJSON | Record<string, unknown>): this {
    try {
      const model = typeof data === "string" ? JSON.parse(data) : data;

      Object.getOwnPropertyNames(this).forEach((key) => {
        if (key in model && typeof model[key] === 'object' && model[key] !== null) {
          this[key] = model[key]
        }
      })
    } catch { /* empty */ }

    return this
  }

  /**
   * Converts the classifier to JSON format.
   * @param {Object} options - Options for JSON serialization.
   * @param {boolean} [options.compact=false] - Whether to output a compact JSON.
   * @param {(x: Record<string, any>) => ModelAsJSON} [options.serializer] - Optional custom serializer function.
   * @returns {ModelAsJSON} The model serialized as JSON.
   */
  toJSON({
    compact,
    serializer,
  }: {
    compact?: boolean
    serializer?: (x: Record<string, unknown>) => ModelAsJSON
  } = {}): ModelAsJSON {
    return (serializer || JSON.stringify)({
      features: Object.fromEntries(this.features),
      matrix: this.matrix,
      corpus: compact ? [] : this.corpus,
      stats: this.stats,
    })
  }

  /**
   * Creates a classifier from a JSON model.
   * @param {ModelAsJSON} model - The model in JSON format.
   * @returns {BayesClassifier<T, K>} The classifier instance.
   */
  static of<T extends Observation, K extends Label>(model: ModelAsJSON): BayesClassifier<T, K> {
    return new this<T, K>().restore(model)
  }
  
  /**
   * Converts an observation to a feature vector.
   * @private
   * @param {Readonly<Document<T, K>['observation']>} observation - The observation to vectorize.
   * @returns {Binary[]} The feature vector.
   */
  private vectorize(observation: Readonly<Document<T, K>['observation']>): Binary[] {
    const vector: Binary[] = []

    for (const feature of this.features.keys()) {
      vector.push(
        observation.includes(feature as T) ? 1 : 0
      )
    }
    
    return vector
  }

  /**
   * Calculates the probability of a label given a feature vector.
   * 
   * Algorithm was heavily inspired in Chris Umbel's
   * https://github.com/NaturalNode/apparatus
   * 
   * @copyright Copyright (c) 2011, Chris Umbel
   * 
   * @private
   * @param {Binary[]} vector - The feature vector.
   * @param {K} label - The label.
   * @returns {number} The probability score.
   */
  private probability(vector: Binary[], label: K): number {
    const total = this.stats.labels[label];
    if (!total) return 0;

    const rest = vector.reduce(
      (acc, value, index) => value
        ? acc += Math.log(
          (this.matrix[label]?.at(index) || this.properties.smoothing) / total
        )
        : acc,
      0 as number
    );

    // p(C) * unlogging the above calculation P(X|C)
    // as mentioned by Chris Umbel
    return (total / this.stats.corpus) * Math.exp(rest);
  }
}
