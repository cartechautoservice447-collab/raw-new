import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

// Tokenizer for GitHub Dark theme highlighting
function highlightCode(code: string, language: string): React.ReactNode[] {
  const lang = (language || '').toLowerCase();
  const lines = code.split('\n');

  return lines.map((line, lineIdx) => {
    // Basic syntax parsing with regular expressions
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    // Regex for comments
    const commentMatch =
      lang === 'python' || lang === 'py' || lang === 'sh' || lang === 'bash'
        ? remaining.match(/^(.*?)(\/\/.*|#.*)$/)
        : remaining.match(/^(.*?)(\/\/.*|\/\*.*\*\/)$/);

    let commentPart = '';
    if (commentMatch) {
      remaining = commentMatch[1];
      commentPart = commentMatch[2];
    }

    // Split words, strings, numbers, punctuation
    const regex =
      /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:def|class|return|import|from|as|if|else|elif|for|while|try|except|finally|with|in|is|not|and|or|lambda|yield|const|let|var|function|async|await|export|default|type|interface|enum|public|private|static|true|false|None|True|False|null|undefined)\b|\b(?:self|print|len|range|input|console|log|document|window|Math|Array|Object|String|Number)\b|\b\d+(?:\.\d+)?\b|[a-zA-Z_$][a-zA-Z0-9_$]*|[{}()\[\];,.:+\-*\/=><!&|^~%]+|\s+)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(remaining)) !== null) {
      const part = match[0];
      const idx = match.index;

      if (idx > lastIndex) {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#c9d1d9' }}>
            {remaining.slice(lastIndex, idx)}
          </span>
        );
      }

      // Check token type
      if (/^["'`]/.test(part)) {
        // String
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#a5d6ff' }}>
            {part}
          </span>
        );
      } else if (
        /^(def|class|return|import|from|as|if|else|elif|for|while|try|except|finally|with|in|is|not|and|or|lambda|yield|const|let|var|function|async|await|export|default|type|interface|enum|public|private|static|true|false|None|True|False|null|undefined)$/.test(
          part
        )
      ) {
        // Keyword
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#ff7b72' }}>
            {part}
          </span>
        );
      } else if (
        /^(print|len|range|input|console|log|document|window|Math|Array|Object|String|Number)$/.test(
          part
        )
      ) {
        // Builtin
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#d2a8ff' }}>
            {part}
          </span>
        );
      } else if (/^\d/.test(part)) {
        // Number
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#79c0ff' }}>
            {part}
          </span>
        );
      } else if (/^[{}()\[\];,.:+\-*\/=><!&|^~%]+$/.test(part)) {
        // Punctuation / Operator
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#c9d1d9' }}>
            {part}
          </span>
        );
      } else if (/^[a-zA-Z_$]/.test(part)) {
        // Identifier: function call or variable
        const nextChar = remaining.slice(regex.lastIndex).trim()[0];
        if (nextChar === '(') {
          tokens.push(
            <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#d2a8ff' }}>
              {part}
            </span>
          );
        } else if (part === 'self') {
          tokens.push(
            <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#79c0ff', fontStyle: 'italic' }}>
              {part}
            </span>
          );
        } else {
          tokens.push(
            <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#c9d1d9' }}>
              {part}
            </span>
          );
        }
      } else {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#c9d1d9' }}>
            {part}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      tokens.push(
        <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#c9d1d9' }}>
          {remaining.slice(lastIndex)}
        </span>
      );
    }

    if (commentPart) {
      tokens.push(
        <span key={`${lineIdx}-${keyIdx++}`} style={{ color: '#8b949e', fontStyle: 'italic' }}>
          {commentPart}
        </span>
      );
    }

    return (
      <div key={lineIdx} className="leading-6">
        {tokens.length > 0 ? tokens : ' '}
      </div>
    );
  });
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose-glass max-w-none text-[0.95rem] leading-7 text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 text-2xl font-semibold tracking-tight first:mt-0 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-6 text-xl font-semibold tracking-tight text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-base font-semibold tracking-tight text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="my-3">{children}</p>,
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-code-variable underline underline-offset-4 hover:opacity-80"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-1 pl-5 text-foreground/90">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-1 pl-5 text-foreground/90">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-accent/60 pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-6 border-white/5" />,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-white/5">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-white/5 px-3 py-2 text-left font-medium text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-white/5 px-3 py-2 text-muted-foreground">{children}</td>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const rawCode = String(children).replace(/\n$/, '');

            if (match) {
              const lang = match[1];
              return (
                <div className="gh-code my-4 overflow-hidden rounded-xl border border-white/5 bg-code-bg shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)]">
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 bg-white/[0.02]">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-code-comment font-medium">
                      {lang}
                    </span>
                  </div>
                  <pre
                    className="p-4 overflow-x-auto font-mono text-sm leading-6"
                    style={{
                      background: '#0d1117',
                      margin: 0,
                      fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
                    }}
                  >
                    <code>{highlightCode(rawCode, lang)}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code
                className="rounded-md border border-white/5 bg-code-bg px-1.5 py-0.5 font-mono text-[0.85em] text-code-string"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
