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

import { RegexpTokenizer } from "./regexp-tokenizer.js";

/**
 * A regular expression pattern used for tokenizing text by splitting on non-alphanumeric characters,
 * including accented characters and underscores.
 * @constant {RegExp}
 * @example
 * // Matches any sequence of non-alphanumeric characters and underscores
 * const pattern = /[^a-zà-òá-úã-õç0-9_]+/i;
 */

const pattern = /[^a-zà-òá-úã-õç0-9_]+/i;

/**
 * Class representing a tokenizer that uses a predefined regular expression pattern
 * to split Portuguese text into words.
 * @extends {RegexpTokenizer}
 */
export class WordsPtTokenizer extends RegexpTokenizer {
  /**
   * Creates an instance of WordsPtTokenizer.
   * Initializes the tokenizer with a pattern that splits text based on non-alphanumeric characters,
   * including accented characters and underscores.
   */
  constructor() {
    super(pattern)
  }
}
