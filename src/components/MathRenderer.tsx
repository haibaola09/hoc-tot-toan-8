import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text }) => {
  if (!text) return null;

  // Pattern to safely match LaTeX block and inline mathematical syntax
  const regex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[\s\S]+?\$|\\\([\s\S]+?\\\))/g;
  const parts = text.split(regex);

  return (
    <span className="leading-relaxed">
      {parts.map((part, index) => {
        // Block math delimiters: $$...$$ or \[...\]
        if (
          (part.startsWith('$$') && part.endsWith('$$')) ||
          (part.startsWith('\\[') && part.endsWith('\\]'))
        ) {
          const isDoubleDollar = part.startsWith('$$');
          const formula = isDoubleDollar ? part.slice(2, -2).trim() : part.slice(2, -2).trim();
          
          try {
            const html = katex.renderToString(formula, {
              displayMode: true,
              throwOnError: false,
              trust: true
            });
            return (
              <span
                key={index}
                className="block my-3 text-center overflow-x-auto text-base text-amber-300 bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (err) {
            return (
              <span key={index} className="block my-2 text-rose-300 bg-rose-500/10 p-3 rounded-xl text-xs font-mono">
                {part}
              </span>
            );
          }
        }
        
        // Inline math delimiters: $...$ or \(...\)
        if (
          (part.startsWith('$') && part.endsWith('$')) ||
          (part.startsWith('\\(') && part.endsWith('\\)'))
        ) {
          const isDollar = part.startsWith('$');
          const formula = isDollar ? part.slice(1, -1).trim() : part.slice(2, -2).trim();
          
          try {
            const html = katex.renderToString(formula, {
              displayMode: false,
              throwOnError: false,
              trust: true
            });
            return (
              <span
                key={index}
                className="inline font-semibold text-amber-400 mx-0.5"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (err) {
            return (
              <span key={index} className="inline px-1 text-rose-300 bg-rose-500/10 rounded font-mono text-xs">
                {part}
              </span>
            );
          }
        }
        
        // Plain text content
        const renderPlainTextWithHighlights = (rawText: string, baseIndex: number) => {
          if (!rawText) return null;
          const tagRegex = /\[SAI:\s*(.+?)\]|\[(?:DUNG|ĐÚNG):\s*(.+?)\]/gi;
          const textParts = rawText.split(tagRegex);
          
          if (textParts.length === 1) {
            return <span className="whitespace-pre-wrap">{rawText}</span>;
          }
          
          const elements: React.ReactNode[] = [];
          for (let i = 0; i < textParts.length; i++) {
            const part = textParts[i];
            if (part === undefined) continue;
            
            const remainder = i % 3;
            if (remainder === 0) {
              if (part !== '') {
                elements.push(<span key={`text-${baseIndex}-${i}`} className="whitespace-pre-wrap">{part}</span>);
              }
            } else if (remainder === 1) {
              elements.push(
                <span 
                  key={`sai-${baseIndex}-${i}`} 
                  className="mx-1 px-2 py-0.5 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold inline-flex items-center gap-1 font-mono text-[11px] align-middle select-all transition-all hover:bg-rose-500/25 cursor-default"
                  title="Cách viết này chưa chính xác"
                >
                  <span className="text-[9px] uppercase tracking-wide bg-rose-500 text-white px-1 leading-normal rounded font-sans font-black select-none shrink-0">SAI</span>
                  <span className="line-through decoration-rose-500 decoration-2">{part}</span>
                </span>
              );
            } else {
              elements.push(
                <span 
                  key={`dung-${baseIndex}-${i}`} 
                  className="mx-1 px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold inline-flex items-center gap-1 font-mono text-[11px] align-middle select-all transition-all hover:bg-emerald-500/25 cursor-default"
                  title="Cách viết chính xác khuyên dùng"
                >
                  <span className="text-[9px] uppercase tracking-wide bg-emerald-600 text-white px-1 leading-normal rounded font-sans font-black select-none shrink-0">ĐÚNG</span>
                  <span>{part}</span>
                </span>
              );
            }
          }
          
          return <span key={`group-${baseIndex}`}>{elements}</span>;
        };

        return (
          <React.Fragment key={index}>
            {renderPlainTextWithHighlights(part, index)}
          </React.Fragment>
        );
      })}
    </span>
  );
};
