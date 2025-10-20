import { useMemo, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder, label, helperText, required }) => {
  const quillRef = useRef(null);

  // Custom onChange handler to get clean HTML
  const handleChange = (content, delta, source, editor) => {
    // Get the HTML content from the editor
    const html = editor.getHTML();
    onChange(html);
  };

  // Quill modules configuration with full toolbar
  const modules = useMemo(() => ({
    toolbar: [
      // Text formatting
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      
      // Text style
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      
      // Text alignment
      [{ 'align': [] }],
      
      // Lists
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      
      // Insert elements
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      
      // Text direction
      [{ 'direction': 'rtl' }],
      
      // Cleanup
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }), [])

  // Quill formats configuration
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'blockquote', 'code-block',
    'direction'
  ];

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="rich-text-editor-wrapper" dir="auto">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value || ''}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || 'Write your content here...'}
          className="bg-white"
        />
      </div>
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
      
      <style jsx>{`
        :global(.rich-text-editor-wrapper .quill) {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: white;
        }
        
        :global(.rich-text-editor-wrapper .ql-toolbar) {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border: 1px solid #d1d5db;
          border-bottom: none;
          background: #f9fafb;
        }
        
        :global(.rich-text-editor-wrapper .ql-container) {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border: 1px solid #d1d5db;
          border-top: none;
          min-height: 200px;
          font-size: 14px;
          font-family: inherit;
        }
        
        :global(.rich-text-editor-wrapper .ql-editor) {
          min-height: 200px;
          max-height: 500px;
          overflow-y: auto;
        }
        
        :global(.rich-text-editor-wrapper .ql-editor.ql-blank::before) {
          color: #9ca3af;
          font-style: italic;
        }
        
        :global(.rich-text-editor-wrapper .ql-snow .ql-picker) {
          font-size: 14px;
        }
        
        /* RTL Support */
        :global(.rich-text-editor-wrapper .ql-editor[dir="rtl"]) {
          text-align: right;
          direction: rtl;
        }
        
        /* Image styles */
        :global(.rich-text-editor-wrapper .ql-editor img) {
          max-width: 100%;
          height: auto;
        }
        
        /* Link styles */
        :global(.rich-text-editor-wrapper .ql-editor a) {
          color: #4f46e5;
          text-decoration: underline;
        }
        
        /* Code block styles */
        :global(.rich-text-editor-wrapper .ql-editor pre) {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
        }
        
        /* Blockquote styles */
        :global(.rich-text-editor-wrapper .ql-editor blockquote) {
          border-left: 4px solid #4f46e5;
          padding-left: 1rem;
          margin-left: 0;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
