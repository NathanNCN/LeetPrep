declare module 'prismjs/components/prism-core' {
  interface Grammar {
    [key: string]: {
      pattern: RegExp | string;
      greedy?: boolean;
      lookbehind?: boolean;
      inside?: Grammar;
    } | Grammar;
  }

  interface Languages {
    [key: string]: Grammar;
    extend(id: string, redef: Grammar): void;
    insertBefore(inside: string, before: string, insert: Grammar, root?: Grammar): Grammar;
  }

  export function highlight(text: string, grammar: Grammar, language: string): string;
  export const languages: Languages;
}
 
declare module 'prismjs/components/prism-python';
declare module 'prismjs/themes/prism-dark.css'; 