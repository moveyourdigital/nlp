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

/**
 * Type representing a model in JSON format.
 */
export type ModelAsJSON = string

/**
 * Type representing an observation, which can be a string or a number.
 */
export type Observation = string | number

/**
 * Type representing a label, which can be a string or a number.
 */
export type Label = string | number

/**
 * Interface representing the classification result.
 * @template K - Type extending Label
 * @interface Classification
 * @property {K} label - The label assigned to the observation.
 * @property {number} score - The confidence score of the classification.
 */
export interface Classification<K extends Label> {
  label: K;
  score: number;
}

/**
 * Interface representing a document consisting of observations and a label.
 * @template T - Type extending Observation
 * @template K - Type extending Label
 * @interface Document
 * @property {T[]} observation - Array of observations.
 * @property {K} label - The label associated with the observations.
 */
export interface Document<T extends Observation, K extends Label> {
  observation: T[];
  label: K;
};

/**
 * Interface representing statistics for a classifier.
 * @template K - Type extending Label
 * @interface Stats
 * @property {Partial<Record<K, number>>} labels - A partial record mapping labels to their counts.
 * @property {number} corpus - The total number of observations in the corpus.
 */
export interface Stats<K extends Label> {
  labels: Partial<Record<K, number>>
  corpus: number
}

/**
 * Abstract class for a classifier.
 * @template T - Type extending Observation
 * @template K - Type extending Label
 * @abstract
 * @class Classifier
 */
export abstract class Classifier<T extends Observation, K extends Label> {
  /**
   * Classifies the given observation.
   * @abstract
   * @param {Readonly<Document<T, K>['observation']>} observation - The observation to classify.
   * @returns {Classification<K>[]} An array of classification results.
   */
  abstract classify(observation: Readonly<Document<T, K>['observation']>): Classification<K>[];

  /**
   * Adds a document to the classifier.
   * @abstract
   * @param {Readonly<Document<T, K>>} document - The document to add.
   * @returns {this}
   */
  abstract addDocument(document: Readonly<Document<T, K>>): this;

  /**
   * Trains the classifier.
   * @abstract
   * @returns {this}
   */
  abstract train(): this;

  /**
   * Converts the model to JSON format.
   * @abstract
   * @param {Object} options - Options for JSON serialization.
   * @param {boolean} [options.compact=false] - Whether to output a compact JSON.
   * @param {(x: Record<string, any>) => ModelAsJSON} [options.serializer] - Optional custom serializer function.
   * @returns {ModelAsJSON} The model serialized as JSON.
   */
  abstract toJSON(options: {
    compact?: boolean;
    serializer?: (x: Record<string, unknown>) => ModelAsJSON;
  }): ModelAsJSON;

  /**
   * Restores the model from JSON format.
   * @abstract
   * @param {ModelAsJSON} model - The model in JSON format.
   * @returns {this}
   */
  abstract restore(model: ModelAsJSON | Record<string, unknown>): this;
}
