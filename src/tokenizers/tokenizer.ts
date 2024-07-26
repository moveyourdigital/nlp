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
 * Abstract class representing a tokenizer.
 * @abstract
 */
export abstract class Tokenizer {
  /**
   * Abstract method that must be implemented by subclasses to tokenize the given text.
   * @abstract
   * @param {string} text - The text to tokenize.
   * @returns {string[]} An array of tokenized strings.
   */
  abstract tokenize(text: string): string[]

  /**
   * Trims the tokens by filtering out any tokens that are `undefined`, `null`, or whitespace-only strings.
   * @param {(string | undefined | null)[]} tokens - An array of tokens to trim.
   * @returns {string[]} An array of trimmed tokens.
   */
  trim(tokens: (string | undefined | null)[]): string[] {
    return tokens.filter((token): token is string => !(token && token.trim()))
  }
}
