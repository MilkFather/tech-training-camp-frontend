/* Meta */
export const CODE_INDENT = 4;

/* Block ID */
export const BLID_DOC = 'document';
export const BLID_QUOTE = 'quote';
export const BLID_LISTITEM = 'li';
export const BLID_HEADER = 'header';
export const BLID_HRULE = 'hr';
export const BLID_CODE = 'code';
export const BLID_PARA = 'paragraph';
export const BLID_LIST = 'list';

/* Block Regex */
export const RE_HRULE = /^(?:(?:\* *){3,}|(?:_ *){3,}|(?:- *){3,}) *$/;
export const RE_HEADER = /^#{1,6}(?: +|$)/;
export const RE_NOSPACE = /[^ \t\n]/;
export const RE_CODEFENCE = /^`{3,}(?!.*`)|^~{3,}(?!.*~)/;
export const RE_CLOSECODEFENCE = /^(?:`{3,}|~{3,})(?= *$)/;
export const RE_ULMARKER = /^[*+-]( +|$)/;
export const RE_OLMARKER = /^(\d+)([.)])( +|$)/;

/* Inline Regex */
export const RE_EMPH = /(\*(.*?)\*([^*]|$))|(_(.*?)_([^_]|$))/;
export const RE_STRONG = /(\*\*(.*?)\*\*([^*]|$))|(__(.*?)__([^_]|$))/;
export const RE_IMAGE = /!\[(.*?)\]\((.*?)\)/;
export const RE_LINK = /\[(.*?)\]\((.*?)\)/;