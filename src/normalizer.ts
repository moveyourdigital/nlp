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
 * Interface representing a tokenizer.
 * @interface
 */
interface ITokenizer {
  /**
   * Tokenizes the given text into an array of strings.
   * @param {string} text - The text to tokenize.
   * @returns {string[]} An array of tokens.
   */
  tokenize(text: string): string[]
}

/**
 * Interface representing a stemmer.
 * @interface
 */
interface IStemmer {
  /**
   * Stems the given token to its root form.
   * @param {string} token - The token to stem.
   * @returns {string} The stemmed token.
   */
  stem(token: string): string
}

/**
 * Type representing an array of stop words.
 */
type StopWords = string[]

/**
 * Class responsible for normalizing text by tokenizing, removing stop words, and stemming.
 */
export class Normalizer {
  /**
   * Creates an instance of Normalizer.
   * @param {Tokenizer} tokenizer - The tokenizer to use for splitting text into tokens.
   * @param {Stemmer} stemmer - The stemmer to use for reducing tokens to their root form.
   * @param {StopWords} [stopwords=[]] - Optional array of stop words to remove from the tokens.
   */
  constructor(private tokenizer: ITokenizer, private stemmer: IStemmer, private stopwords: StopWords = []) {}

  /**
   * Normalizes the given text by tokenizing, removing stop words, and stemming each token.
   * @param {string} text - The text to normalize.
   * @returns {string[]} An array of normalized tokens.
   */
  normalize(text: string): string[] {
    return this.tokenizer.tokenize(text)
      .filter((it) => !this.stopwords.includes(it))
      .map(this.stemmer.stem)
  }
}
