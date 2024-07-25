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

import { Tokenizer } from "./tokenizer.js";

/**
 * Class representing a tokenizer that uses a regular expression to split text.
 * @extends {Tokenizer}
 */
export class RegexpTokenizer extends Tokenizer {
  /**
   * Creates an instance of RegexpTokenizer.
   * @param {RegExp} pattern - The regular expression pattern used for tokenization.
   */
  constructor (private pattern: RegExp) {
    super()
  }

  /**
   * Tokenizes the given text into an array of lowercase strings based on the regular expression pattern.
   * @param {string} text - The text to tokenize.
   * @returns {string[]} An array of tokenized strings in lowercase.
   */
  tokenize(text: string): string[] {
    return text
      .split(this.pattern)
      .map(Function.prototype.call, String.prototype.toLowerCase)
  }
}
