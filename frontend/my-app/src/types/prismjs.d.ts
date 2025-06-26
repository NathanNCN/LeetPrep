declare module 'prismjs/components/prism-core' {
  export function highlight(text: string, grammar: any, language: string): string;
  export const languages: any;
}
 
declare module 'prismjs/components/prism-python';
declare module 'prismjs/themes/prism-dark.css'; 