// Tokens copied from https://go.dev/src/go/token/token.go

enum TokenType {
    ILLEGAL,

    EOF,
    COMMENT,

// classes of literals
    literal_beg,
    IDENT,
    INT, // 12345
    FLOAT, // 123.45
    IMAG, // 123.45i
    CHAR, // 'a'
    STRING, // "abc"
    literal_end,

// operators
    operator_beg,
    ADD, // +
    SUB, // -
    MUL, // *
    QUO, // /
    REM, // %

    AND, // &
    OR, // |
    XOR, // ^
    SHL, // <<
    SHR, // >> 
    AND_NOT, // &^

    ADD_ASSIGN, // +=
    SUB_ASSIGN, // -=
    MUL_ASSIGN, // *=
    QUO_ASSIGN, // /=
    REM_ASSIGN, // %=

    AND_ASSIGN, // &=
    OR_ASSIGN, // |=
    XOR_ASSIGN, // ^=
    SHL_ASSIGN, // <<=
    SHR_ASSIGN, // >>=
    AND_NOT_ASSIGN, // &^=

    LAND, // &&
    LOR, // ||
    ARROW, // <-
    INC, // ++
    DEC, // --

    EQL, // ==
    LSS, // <
    GTR, // >
    ASSIGN, // =
    NOT, // !

    NEQ, // !=
    LEQ, // <=
    GEQ, // >=
    DEFINE, // :=
    ELLIPSIS, // ...

    LPAREN, // (
    LBRACK, // [
    LBRACE, // {
    COMMA, // ,
    PERIOD, // .

    RPAREN, // )
    RBRACK, // ]
    RBRACE, // }
    SEMICOLON, // ;
    COLON, // ;
    operator_end,

    // keywords
    keyword_beg,
    BREAK,
    CASE,
    CHAN,
    CONST,
    CONTINUE,

    DEFAULT,
    DEFER,
    ELSE,
    FALLTHROUGH,
    FOR,

    FUNC,
    GO,
    GOTO,
    IF,
    IMPORT,

    INTERFACE,
    MAP,
    PACKAGE,
    RANGE,
    RETURN,

    SELECT,
    STRUCT,
    SWITCH,
    TYPE,
    VAR,
    keyword_end,

    // additional
    additional_beg,
    TILDE,
    additional_end,
}

const tokens = new Map<TokenType, string>([
    [TokenType.ILLEGAL, "ILLEGAL"],
    [TokenType.EOF, "EOF"],
    [TokenType.COMMENT, "COMMENT"],

    [TokenType.IDENT, "IDENT"],
    [TokenType.INT, "INT"],
    [TokenType.FLOAT, "FLOAT"],
    [TokenType.IMAG, "IMAG"],
    [TokenType.CHAR, "CHAR"],
    [TokenType.STRING, "STRING"],

    [TokenType.ADD, "+"],
    [TokenType.SUB, "-"],
    [TokenType.MUL, "*"],
    [TokenType.QUO, "/"],
    [TokenType.REM, "%"],

    [TokenType.AND, "&"],
    [TokenType.OR, "|"],
    [TokenType.XOR, "^"],
    [TokenType.SHL, "<<"],
    [TokenType.SHR, ">>"],
    [TokenType.AND_NOT, "&^"],

    [TokenType.ADD_ASSIGN, "+="],
    [TokenType.SUB_ASSIGN, "-="],
    [TokenType.MUL_ASSIGN, "*="],
    [TokenType.QUO_ASSIGN, "/="],
    [TokenType.REM_ASSIGN, "%="],

    [TokenType.AND_ASSIGN, "&="],
    [TokenType.OR_ASSIGN, "|="],
    [TokenType.XOR_ASSIGN, "^="],
    [TokenType.SHL_ASSIGN, "<<="],
    [TokenType.SHR_ASSIGN, ">>="],
    [TokenType.AND_NOT_ASSIGN, "&^="],

    [TokenType.LAND, "&&"],
    [TokenType.LOR, "||"],
    [TokenType.ARROW, "<-"],
    [TokenType.INC, "++"],
    [TokenType.DEC, "--"],

    [TokenType.EQL, "=="],
    [TokenType.LSS, "<"],
    [TokenType.GTR, ">"],
    [TokenType.ASSIGN, "="],
    [TokenType.NOT, "!"],

    [TokenType.NEQ, "!="],
    [TokenType.LEQ, "<="],
    [TokenType.GEQ, ">="],
    [TokenType.DEFINE, ":="],
    [TokenType.ELLIPSIS, "..."],

    [TokenType.LPAREN, "("],
    [TokenType.LBRACK, "["],
    [TokenType.LBRACE, "{"],
    [TokenType.COMMA, ","],
    [TokenType.PERIOD, "."],

    [TokenType.RPAREN, ")"],
    [TokenType.RBRACK, "]"],
    [TokenType.RBRACE, "}"],
    [TokenType.SEMICOLON, ";"],
    [TokenType.COLON, ":"],

    [TokenType.BREAK, "break"],
    [TokenType.CASE, "case"],
    [TokenType.CHAN, "chan"],
    [TokenType.CONST, "const"],
    [TokenType.CONTINUE, "continue"],

    [TokenType.DEFAULT, "default"],
    [TokenType.DEFER, "defer"],
    [TokenType.ELSE, "else"],
    [TokenType.FALLTHROUGH, "fallthrough"],
    [TokenType.FOR, "for"],

    [TokenType.FUNC, "func"],
    [TokenType.GO, "go"],
    [TokenType.GOTO, "goto"],
    [TokenType.IF, "if"],
    [TokenType.IMPORT, "import"],

    [TokenType.INTERFACE, "interface"],
    [TokenType.MAP, "map"],
    [TokenType.PACKAGE, "package"],
    [TokenType.RANGE, "range"],
    [TokenType.RETURN, "return"],

    [TokenType.SELECT, "select"],
    [TokenType.STRUCT, "struct"],
    [TokenType.SWITCH, "switch"],
    [TokenType.TYPE, "type"],
    [TokenType.VAR, "var"],

    [TokenType.TILDE, "~"],
])

// Returns string corresponding to token type
export function getTokenString(tok: TokenType) : string {
    let s = ""
    if (0 <= tok && tok < tokens.size) {
        s = tokens[tok]
    }
    if (s == "") {
        s = "token(" + tok.toString() + ")"
    }
    return s
}

export const LowestPrec = 0;
export const UnaryPrec = 6;
export const HighestPrec = 7;

export function calcPrecedence(tok: TokenType) : number {
    switch (tok) {
        case TokenType.LOR:
            return 1;
        case TokenType.LAND:
            return 2;
        case TokenType.EQL, TokenType.NEQ, TokenType.LSS, 
            TokenType.LSS, TokenType.LEQ, TokenType.GTR, TokenType.GEQ:
            return 3;
        case TokenType.ADD, TokenType.SUB, TokenType.OR, TokenType.XOR:
            return 4;
        case TokenType.MUL, TokenType.QUO, TokenType.REM, TokenType.SHL,
            TokenType.SHR, TokenType.AND, TokenType.AND_NOT:
            return 5;
        default:
            return LowestPrec;
    }
}

let keywords : Map<string, TokenType>;

export function init() {
    keywords = new Map<string, TokenType>();
    for (let i = TokenType.keyword_beg + 1; i < TokenType.keyword_end; ++i) {
        keywords.set(tokens[i], i);
    }
}

// Maps identifier to its keyword token or [IDENT] if not a keyword
export function lookup(ident : string) : TokenType {
    if (keywords.has(ident)) {
        return keywords[ident]
    }
    return TokenType.IDENT;
}

// Returns whether the token is a literal
export function isLiteral(token : TokenType) : boolean {
    return TokenType.literal_beg < token && token < TokenType.literal_end;
}

// Returns whether the token is an operator
export function isOperator(token: TokenType) : boolean {
    return TokenType.operator_beg < token && token < TokenType.operator_end;
}

// Returns whether the token is a keyword
export function isKeyword(token : TokenType) : boolean {
    return TokenType.keyword_beg < token && token < TokenType.keyword_end;
}

// Returns whether name is a Go keyword
export function isGoKeyword(name : string) : boolean {
    return keywords.has(name);
}

function isLetter(c : number) : boolean {
    return (65 <= c && c <= 90) || (97 <= c && c <= 122);
}

function isNumber(c : number) : boolean {
    return 48 <= c && c <= 57;
}

function isUnderscore(c : number) : boolean {
    return c == 95;
}

// Returns whether name is a Go identifier (made up of letters,
// digits, and underscores, and first character is not a digit).
// Keywords are not identifiers
export function isIdentifier(name : string) : boolean {
    if (name == "" || isGoKeyword(name)) {
        return false;
    }
    if (isNumber(name.charCodeAt(0))) {
        return false;
    }
    for (let i = 0; i < name.length; ++i) {
        const charCode = name.charCodeAt(i);
        if (!(isLetter(charCode) || isNumber(charCode) || isUnderscore(charCode))) {
            return false;
        }
    }
    return true;
}