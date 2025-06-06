"use client";

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeSnippetProps {
  language: string;
  content: string;
}

export default function CodeSnippet({ language, content }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  // Map common file extensions to highlight.js language names
  const getLanguage = (extension: string): string => {
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'java': 'java',
      'cs': 'csharp',
      'cpp': 'cpp',
      'c': 'c',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'sh': 'bash',
      'yml': 'yaml',
      'yaml': 'yaml',
      'json': 'json',
      'md': 'markdown',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sql': 'sql',
      'tsx': 'tsx',
      'jsx': 'jsx',
    };

    return langMap[extension.toLowerCase()] || extension;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/70 transition-colors z-10 cursor-pointer"
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? (
          <Check size={16} className="text-green-400" />
        ) : (
          <Copy size={16} className="text-gray-300" />
        )}
      </button>
      <SyntaxHighlighter
        language={getLanguage(language)}
        style={atomDark}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.375rem 0.375rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          paddingTop: '2.5rem', // Add padding to avoid overlap with the copy button
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}
