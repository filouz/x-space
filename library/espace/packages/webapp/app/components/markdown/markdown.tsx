"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { RootState } from '@/lib/redux/types'; // Adjust the import path as needed

interface MarkdownComponentProps {
  content: string;
}

const MarkdownComponent = ({ content }: MarkdownComponentProps) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

const MarkdownPanel = () => {
    const markdownContent = useSelector((state: RootState) => state.markdown.content);
  
    return (
      <div>
        <span style={{ "fontSize": "xx-large", "fontWeight": 600}}>Last known phone address</span>
        <MarkdownComponent content={markdownContent} />
      </div>
    );
};

export default MarkdownPanel;
