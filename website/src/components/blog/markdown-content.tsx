"use client";

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';
import { slug } from 'github-slugger';
import { Copy, Check } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Handle anchor link scrolling
  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);

      if (element) {
        // Wait a bit for the page to fully render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
        components={{
          // Add custom styling for markdown elements
          h1: ({node, children, ...props}) => {
            const headingId = slug(children as string);
            return (
              <h1 id={headingId} className="text-3xl font-bold mt-8 mb-4 scroll-mt-20 group" {...props}>
                <a href={`#${headingId}`} className="no-underline relative">
                  <span className="absolute -left-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    #
                  </span>
                  {children}
                </a>
              </h1>
            );
          },
          h2: ({node, children, ...props}) => {
            const headingId = slug(children as string);
            return (
              <h2 id={headingId} className="text-2xl font-bold mt-8 mb-4 scroll-mt-20 group" {...props}>
                <a href={`#${headingId}`} className="no-underline relative">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    #
                  </span>
                  {children}
                </a>
              </h2>
            );
          },
          h3: ({node, children, ...props}) => {
            const headingId = slug(children as string);
            return (
              <h3 id={headingId} className="text-xl font-bold mt-6 mb-3 scroll-mt-20 group" {...props}>
                <a href={`#${headingId}`} className="no-underline relative">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    #
                  </span>
                  {children}
                </a>
              </h3>
            );
          },
          h4: ({node, children, ...props}) => {
            const headingId = slug(children as string);
            return (
              <h4 id={headingId} className="text-lg font-bold mt-4 mb-2 scroll-mt-20 group" {...props}>
                <a href={`#${headingId}`} className="no-underline relative">
                  <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    #
                  </span>
                  {children}
                </a>
              </h4>
            );
          },
          p: ({node, ...props}) => <p className="my-4" {...props} />,
          a: ({node, href, ...props}) => {
            // Check if it's an anchor link
            const isAnchor = href?.startsWith('#');
            return (
              <a
                className={`${isAnchor ? 'no-underline' : 'text-blue-600 dark:text-blue-400 hover:underline'}`}
                href={href}
                {...props}
              />
            );
          },
          ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4" {...props} />,
          li: ({node, ...props}) => <li className="my-1" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4" {...props} />,
          img: ({node, ...props}) => <img className="max-w-full h-auto rounded-lg my-4" {...props} />,
          pre: ({node, children, ...props}) => {
            const childrenArray = React.Children.toArray(children);
            // Extract the code string from the children
            let codeString = '';
            if (childrenArray.length > 0 && React.isValidElement(childrenArray[0])) {
              // @ts-ignore
              const codeElement = childrenArray[0].props.children;
              if (typeof codeElement === 'string') {
                codeString = codeElement;
              } else if (Array.isArray(codeElement)) {
                codeString = codeElement.join('');
              }
            }

            const isCopied = codeString === copiedCode;

            return (
              <div className="relative my-4">
                <button
                  onClick={() => handleCopyCode(codeString)}
                  className="absolute top-2 right-2 p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/70 transition-colors z-10 cursor-pointer"
                  aria-label="Copy code"
                  title="Copy code"
                >
                  {isCopied ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-gray-300" />
                  )}
                </button>
                <pre className="p-4 pt-10 rounded-lg bg-slate-950 text-slate-50 dark:bg-slate-950 dark:text-slate-50 overflow-x-auto border border-slate-800" {...props}>
                  {children}
                </pre>
              </div>
            );
          },
          code: ({node, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            return !match ? (
              <code className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            ) : (
              <code className={`${className} text-slate-50`} {...props}>
                {children}
              </code>
            );
          },
          table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props} /></div>,
          th: ({node, ...props}) => <th className="px-3 py-2 text-left font-semibold bg-gray-100 dark:bg-gray-800" {...props} />,
          td: ({node, ...props}) => <td className="px-3 py-2 border-t border-gray-200 dark:border-gray-800" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
