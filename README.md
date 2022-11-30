JavaScript port of [HtmlDiff.NET](https://github.com/Rohland/htmldiff.net)

## Installation

`npm install html-diff-ts --save`

## Project Description

Comparing two HTML blocks, and returns a meshing of the two that includes `<ins>` and `<del>` elements. The classes of these elements are `ins.diffins` for new code, `del.diffdel` for removed code, and `del.diffmod` and `ins.diffmod` for sections of code that have been changed.

For "special tags" (primarily style tags such as `<em>` and `<strong>`), `ins.mod` elements are inserted with the new styles.

## API

Options:

-   `blocksExpression` - list of Regular Expressions which will be countes as one block (token) instead of dividing it on parts by default mechanism (better see example)
    -   `exp` - Regular Expression for token itself
    -   `compareBy` - Regular Expression for part of the token by which will be comparison made

## Usage

### Basic

```javascript
import diff from 'html-diff-ts';

let oldHtml = '<p>Some <em>old</em> html here</p>';
let newHtml = '<p>Some <b>new</b> html goes here</p>';

let result = diff(oldHtml, newHtml);
```

Result:

```html
<p>
    Some <del><em>old</em></del> <ins> <b>new</b> </ins> html here
</p>
```

Visualization:

```diff
Some
- <em>old</em>
+ <b>new</b>
html here
```

### With blocksExpression

The tokenizer works by running the diff on words, but sometimes this isn't ideal. For example, it may look clunky when a date is edited from 12 Jan 2022 to 14 Feb 2022. It might be neater to treat the diff on the entire date rather than the independent tokens.
You can achieve this using AddBlockExpression. Note, the Regex example is not meant to be exhaustive to cover all dates. If text matches the expression, the entire phrase is included as a single token to be compared, and that results in a much neater output.

```javascript
import diff from 'html-diff-ts';

let oldHtml = '<p>12.11.2022</p>';
let newHtml = '<p>15.12.2022</p>';
let dateRegepx = /\d\d\.\d\d\.\d\d\d\d/gm;

let result = (oldHtml, newHtml, {blocksExpression: [{exp: dateRegepx}]});
```

Result:

```html
<p>
    <p><del>12.11.2022</del> <ins>15.12.2022</ins></p>
</p>
```

Visualization:

```diff
<p>
- <em>12.11.2022</em>
+ <b>15.12.2022</b>
</p>
```

### With blocksExpression and compareBy
No diff
```javascript
import diff from 'html-diff-ts';

let oldHtml = '<img src="./old.png" title="title-1" />'; // "src" attr is different but "title" - is the same
let newHtml = '<img src="./new.png" title="title-1" />'; // "src" attr is different but "title" - is the same

let result =
    (oldHtml,
    newHtml,
    {
        blocksExpression: [
            {
                exp: /<img[\w\W]+?\/>/g, // match <img/> tag
                compareBy: /title="[\w\W]+?"/g, // compare only by title="" attribute
            },
        ],
    });
```

Result:
Will return the new string without comparison to old one - because title attrubite is the same

```html
<img src="./new.png" title="title-1" />
```

Has diff
```javascript
import diff from 'html-diff-ts';

let oldHtml = '<img src="./old.png" title="old-title" />'; // "title" attr is different
let newHtml = '<img src="./new.png" title="new-title" />'; // "title" attr is different

let result =
    (oldHtml,
    newHtml,
    {
        blocksExpression: [
            {
                exp: /<img[\w\W]+?\/>/g, // match <img/> tag
                compareBy: /title="[\w\W]+?"/g, // compare only by title="" attribute
            },
        ],
    });
```

Result:
Will return the new string with diff to old one - because title attrubite has changed

```html
<del>
    <img src="./old.png" title="old-title" />
</del>
<ins>
    <img src="./new.png" title="new-title" />
</ins>
```

Visualization:

```diff
<p>
- <img src="./old.png" title="old-title" />
+ <img src="./new.png" title="new-title" />
</p>
```
