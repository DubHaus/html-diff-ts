import diff from '../index';

describe('diff', () => {
    it('should be a function', () => {
        expect(typeof diff).toBe('function');
    });

    it('take two strings and return one', () => {
        expect(typeof diff(' ', ' ')).toBe('string');
    });

    it('take third parametr as array of objects with blocksExpression field in them', () => {
        expect(() => diff(' ', ' ', {blocksExpression: []})).not.toThrowError();
    });

    it('if two strings are the same - return same string', () => {
        expect(diff(' same ', ' same ', {blocksExpression: []})).toBe(' same ');
    });

    it('when blocksExpression.exp specified - will group part of string that match to that regexp into one token', () => {
        let dateRegepx = /\d\d\.\d\d\.\d\d\d\d/gm;
        expect(
            diff(` text 19.12.2022`, ` text 20.12.2022`, {
                blocksExpression: [
                    {
                        exp: dateRegepx,
                    },
                ],
            })
        ).toBe(
            ' text <del class="diffmod">19.12.2022</del><ins class="diffmod">20.12.2022</ins>'
        );
    });
    it(`when blocksExpression.compareBy specified - will group part of string that match (blocksExpression.exp)
        into one token and compare by match from (blocksExpression.compareBy)`, () => {
        expect(
            diff(
                `<img src="./image.png" title="title-1" />`, // "title" attr the same; "src" - attr - not
                `<img src="./other.png" title="title-1" />`, // "title" attr the same; "src" - attr - not
                {
                    blocksExpression: [
                        {
                            exp: /<img[\w\W]+?\/>/g, // match <img/> tag
                            compareBy: /title="[\w\W]+?"/g, // compare only by title="" attribute
                        },
                    ],
                }
            )
        ).toBe(`<img src="./other.png" title="title-1" />`); // same, because we compared by title

        expect(
            diff(
                `<img src="./image.png" title="title-1" />`, // "title" attr now different;
                `<img src="./other.png" title="other-title" />`, // "title" attr now different;
                {
                    blocksExpression: [
                        {
                            exp: /<img[\w\W]+?\/>/g, // match <img/> tag
                            compareBy: /title="[\w\W]+?"/g, // compare only by title="" attribute
                        },
                    ],
                }
            )
        ).toBe(
            `<del class="diffmod"><img src="./image.png" title="title-1" /></del><ins class="diffmod"><img src="./other.png" title="other-title" /></ins>`
        ); // different, because we compared by title
    });
});
