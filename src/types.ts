export enum Mode {
    character,
    tag,
    whitespace,
    number,
    entity,
}

export enum Action {
    equal,
    delete,
    insert,
    none,
    replace,
}

export type MatchOptions = {
    blockSize: number;
    repeatingWordsAccuracy: number;
    ignoreWhitespaceDifferences: boolean;
};

export type BlockExpression = {
    exp: RegExp;
    compareBy?: RegExp;
};
