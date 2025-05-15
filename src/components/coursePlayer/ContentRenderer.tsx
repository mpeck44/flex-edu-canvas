
import React from 'react';
import { ContentBlock } from '@/pages/studentDashboard/types';

interface ContentRendererProps {
  lessonContent: ContentBlock[];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ lessonContent }) => {
  return (
    <div className="prose max-w-full mb-8">
      {lessonContent.map((block, index) => {
        switch(block.type) {
          case 'text':
            return <p key={index}>{block.content}</p>;
          case 'image':
            return <img key={index} src={block.content} alt="Lesson content" className="my-4" />;
          case 'video':
            return (
              <div key={index} className="my-4">
                <iframe 
                  width="100%" 
                  height="400" 
                  src={block.content} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            );
          case 'link':
            return (
              <div key={index} className="my-2">
                <a href={block.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {block.content}
                </a>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ContentRenderer;
