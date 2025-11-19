'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function CreateNewsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [reporterImage, setReporterImage] = useState<File | null>(null);
  const [reporterName, setReporterName] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [status_post, setStatusPost] = useState('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Publish options states
  const [showStatusEdit, setShowStatusEdit] = useState(false);
  const [showVisibilityEdit, setShowVisibilityEdit] = useState(false);
  const [showPublishEdit, setShowPublishEdit] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [stickToFrontPage, setStickToFrontPage] = useState(false);
  const [publishSchedule, setPublishSchedule] = useState('immediately');
  const [publishDate, setPublishDate] = useState(new Date());

  // Text formatting states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');
  const [textFormat, setTextFormat] = useState('paragraph');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryList, setCategoryList] = useState([
    'রাজনীতি',
    'জাতীয়',
    'অর্থনীতি',
    'সারাদেশ',
    'আন্তর্জাতিক',
    'বিনোদন',
    'খেলা',
    'চাকরি',
    'জীবনধারা',
    'স্বাস্থ্য',
  ]);

  // Categories list - matching the image
  const categories = categoryList;

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    router.push('/admin/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category.join(', '));
      formData.append('reporterName', reporterName);
      formData.append('status', status_post);
      
      if (featuredImage) {
        formData.append('featuredImage', featuredImage);
      }
      
      if (reporterImage) {
        formData.append('reporterImage', reporterImage);
      }

      // Send to API
      const response = await fetch('/api/news/create', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create news');
      }

      console.log('✅ News created successfully:', data);
      alert(`News created successfully! ID: ${data.news.id}`);
      
      // Redirect to dashboard after successful creation
      router.push('/admin/dashboard');
      router.refresh();
    } catch (error) {
      console.error('❌ Error creating news:', error);
      alert(error instanceof Error ? error.message : 'Failed to create news. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setStatusPost('draft');
    alert('Draft saved!');
    // Auto-save logic here
  };

  const handlePreview = () => {
    alert('Preview functionality will open in new tab');
    // TODO: Implement preview
  };

  // Text formatting functions
  const toggleBold = () => setIsBold(!isBold);
  const toggleItalic = () => setIsItalic(!isItalic);
  const toggleUnderline = () => setIsUnderline(!isUnderline);

  const handleTextAlign = (align: string) => {
    setTextAlign(align);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    if (size >= 8 && size <= 72) {
      setFontSize(size);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value;
    setTextFormat(format);

    // Apply font size based on format
    switch (format) {
      case 'heading1':
        setFontSize(32);
        setIsBold(true);
        break;
      case 'heading2':
        setFontSize(28);
        setIsBold(true);
        break;
      case 'heading3':
        setFontSize(24);
        setIsBold(true);
        break;
      case 'heading4':
        setFontSize(20);
        setIsBold(true);
        break;
      case 'heading5':
        setFontSize(18);
        setIsBold(true);
        break;
      case 'heading6':
        setFontSize(16);
        setIsBold(true);
        break;
      case 'preformatted':
        setFontSize(14);
        setIsBold(false);
        break;
      default: // paragraph
        setFontSize(16);
        setIsBold(false);
    }
  };

  const insertTextAtCursor = (before: string, after: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) + before + selectedText + after + content.substring(end);

    setContent(newText);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length,
      );
    }, 0);
  };

  const handleBulletList = () => insertTextAtCursor('\n• ', '');
  const handleNumberedList = () => insertTextAtCursor('\n1. ', '');
  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) insertTextAtCursor(`[Link](${url})`, '');
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategoryList([...categoryList, newCategoryName.trim()]);
      setNewCategoryName('');
      setShowAddCategory(false);
      alert(`Category "${newCategoryName}" added successfully!`);
    }
  };

  const handleCancelAddCategory = () => {
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-300">
        <div className="px-5 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl  font-extrabold text-gray-800">Add Post</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          {/* Main Content Area */}
          <div className="space-y-4">
            {/* Title Input */}
            <div className="border border-gray-300 bg-white">
              <input
                type="text"
                placeholder="Add Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-lg font-normal border-0 border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 bg-gray-50"
                required
              />

              {/* Editor Toolbar */}
              <div className="border-b border-gray-300 bg-gray-100 px-2 py-2 flex items-center gap-2 flex-wrap">
                {/* Paragraph/Heading Selector */}
                <div className="relative">
                  <select
                    value={textFormat}
                    onChange={handleFormatChange}
                    className="text-sm border border-gray-300 bg-white px-3 py-1.5 pr-8 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="paragraph">Paragraph</option>
                    <option value="heading1">Heading 1</option>
                    <option value="heading2">Heading 2</option>
                    <option value="heading3">Heading 3</option>
                    <option value="heading4">Heading 4</option>
                    <option value="heading5">Heading 5</option>
                    <option value="heading6">Heading 6</option>
                    <option value="preformatted">Preformatted</option>
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                <div className="border-l border-gray-400 h-6 mx-1"></div>

                {/* Text Formatting */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleBold}
                    className={`p-2 hover:bg-gray-200 rounded ${
                      isBold ? 'bg-blue-500 text-white' : ''
                    }`}
                    title="Bold"
                  >
                    <span className="font-bold text-sm">B</span>
                  </button>
                  <button
                    type="button"
                    onClick={toggleItalic}
                    className={`p-2 hover:bg-gray-200 rounded ${
                      isItalic ? 'bg-blue-500 text-white' : ''
                    }`}
                    title="Italic"
                  >
                    <span className="italic text-sm">I</span>
                  </button>
                  <button
                    type="button"
                    onClick={toggleUnderline}
                    className={`p-2 hover:bg-gray-200 rounded ${
                      isUnderline ? 'bg-blue-500 text-white' : ''
                    }`}
                    title="Underline"
                  >
                    <span className="underline text-sm">U</span>
                  </button>
                </div>

                <div className="border-l border-gray-400 h-6 mx-1"></div>

                {/* Text Alignment */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTextAlign('left')}
                    className={`p-2 hover:bg-gray-200 rounded ${
                      textAlign === 'left' ? 'bg-blue-500 text-white' : ''
                    }`}
                    title="Align left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h8m-8 6h16"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTextAlign('center')}
                    className={`p-2 hover:bg-gray-200 rounded ${
                      textAlign === 'center' ? 'bg-blue-500 text-white' : ''
                    }`}
                    title="Align center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M8 12h8M4 18h16"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTextAlign('right')}
                    className={`p-2 hover:bg-gray-200 rounded ${
                      textAlign === 'right' ? 'bg-blue-500 text-white' : ''
                    }`}
                    title="Align right"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M12 12h8M4 18h16"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTextAlign('justify')}
                    className={`p-2 hover:bg-gray-200 rounded ${
                      textAlign === 'justify' ? 'bg-blue-500 text-white' : ''
                    }`}
                    title="Justify"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="border-l border-gray-400 h-6 mx-1"></div>

                {/* Font Size */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Size:</label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    min="8"
                    max="72"
                    className="w-14 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="border-l border-gray-400 h-6 mx-1"></div>

                {/* Text Color */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Color:</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={handleColorChange}
                    className="w-10 h-7 border border-gray-300 rounded cursor-pointer"
                    title="Text color"
                  />
                </div>

                <div className="border-l border-gray-400 h-6 mx-1"></div>

                {/* Lists and Links */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleBulletList}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Bullet list"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNumberedList}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Numbered list"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleLink}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditorMode('visual')}
                    className={`px-2 py-1 text-xs rounded ${
                      editorMode === 'visual'
                        ? 'bg-white border border-gray-300'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Visual
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('code')}
                    className={`px-2 py-1 text-xs rounded ${
                      editorMode === 'code'
                        ? 'bg-white border border-gray-300'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Code
                  </button>
                </div>
              </div>

              {/* Content Editor */}
              <textarea
                ref={contentRef}
                placeholder="Start writing your news content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="w-full px-3 py-3 border-0 focus:outline-none focus:ring-0 resize-none"
                style={{
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: isUnderline ? 'underline' : 'none',
                  textAlign: textAlign as 'left' | 'center' | 'right' | 'justify',
                  fontSize: `${fontSize}px`,
                  color: textColor,
                }}
                required
              />

              <div className="px-3 py-2 border-t border-gray-300 bg-gray-50 text-xs text-gray-600">
                Word count: {content.split(/\s+/).filter(Boolean).length}
              </div>
            </div>

            {/* Extra Fields */}
            <div className="border border-gray-300 bg-white">
              <div className="px-4 py-3 border-b border-gray-300 bg-gray-50">
                <span>Extra Fields</span>
              </div>
              <div className="px-4 py-4 space-y-4">
                {/* Upload Reporter Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Reporter Image
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReporterImage(e.target.files?.[0] || null)}
                      className="hidden"
                      id="reporter-image"
                    />
                    <label
                      htmlFor="reporter-image"
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded cursor-pointer hover:bg-blue-50"
                    >
                      Add or Upload File
                    </label>
                    {reporterImage && (
                      <span className="text-sm text-gray-600">{reporterImage.name}</span>
                    )}
                  </div>
                </div>

                {/* Reporter Name Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporter Name Text
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter reporter name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publish Box */}
            <div className="border border-gray-300 bg-white">
              <div className="px-4 py-3 border-b border-gray-300 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800">Publish</h3>
              </div>
              <div className="px-4 py-4 space-x-8">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-400 rounded shadow-sm hover:bg-gray-50"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handlePreview}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-gray-400 rounded shadow-sm hover:bg-gray-50"
                >
                  Preview
                </button>

                <div className="border-t border-gray-200 pt-3 space-y-3 text-xs">
                  {/* Status Edit */}
                  <div className="flex items-start">
                    <svg
                      className="w-4 h-4 mr-2 mt-0.5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      {!showStatusEdit ? (
                        <div className="font-medium text-gray-700">
                          Status:{' '}
                          <button
                            type="button"
                            onClick={() => setShowStatusEdit(true)}
                            className="text-blue-600 hover:underline font-normal"
                          >
                            {status_post === 'draft' ? 'Draft' : 'Published'}
                          </button>{' '}
                          <button
                            type="button"
                            onClick={() => setShowStatusEdit(true)}
                            className="text-blue-600 hover:underline font-normal"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <select
                            value={status_post}
                            onChange={(e) => setStatusPost(e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowStatusEdit(false)}
                              className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                              OK
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowStatusEdit(false);
                                setStatusPost('draft');
                              }}
                              className="px-2 py-1 text-xs text-gray-700 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visibility Edit */}
                  <div className="flex items-start">
                    <svg
                      className="w-4 h-4 mr-2 mt-0.5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      {!showVisibilityEdit ? (
                        <div className="font-medium text-gray-700">
                          Visibility:{' '}
                          <button
                            type="button"
                            onClick={() => setShowVisibilityEdit(true)}
                            className="text-blue-600 hover:underline font-normal"
                          >
                            {visibility === 'public'
                              ? 'Public'
                              : visibility === 'password'
                              ? 'Password protected'
                              : 'Private'}
                          </button>{' '}
                          <button
                            type="button"
                            onClick={() => setShowVisibilityEdit(true)}
                            className="text-blue-600 hover:underline font-normal"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={visibility === 'public'}
                              onChange={() => setVisibility('public')}
                              className="w-3 h-3"
                            />
                            <span>Public</span>
                          </label>
                          {visibility === 'public' && (
                            <label className="flex items-center space-x-2 ml-5">
                              <input
                                type="checkbox"
                                checked={stickToFrontPage}
                                onChange={(e) => setStickToFrontPage(e.target.checked)}
                                className="w-3 h-3"
                              />
                              <span>Stick this post to the front page</span>
                            </label>
                          )}
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={visibility === 'password'}
                              onChange={() => setVisibility('password')}
                              className="w-3 h-3"
                            />
                            <span>Password protected</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={visibility === 'private'}
                              onChange={() => setVisibility('private')}
                              className="w-3 h-3"
                            />
                            <span>Private</span>
                          </label>
                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setShowVisibilityEdit(false)}
                              className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                              OK
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowVisibilityEdit(false);
                                setVisibility('public');
                              }}
                              className="px-2 py-1 text-xs text-gray-700 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Publish Date Edit */}
                  <div className="flex items-start">
                    <svg
                      className="w-4 h-4 mr-2 mt-0.5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex-1">
                      {!showPublishEdit ? (
                        <div className="font-medium text-gray-700">
                          Publish:{' '}
                          <button
                            type="button"
                            onClick={() => setShowPublishEdit(true)}
                            className="text-blue-600 hover:underline font-normal"
                          >
                            {publishSchedule === 'immediately'
                              ? 'immediately'
                              : publishDate.toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }) +
                                ' @ ' +
                                publishDate.toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                          </button>{' '}
                          <button
                            type="button"
                            onClick={() => setShowPublishEdit(true)}
                            className="text-blue-600 hover:underline font-normal"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <select
                              value={publishDate.getDate()}
                              onChange={(e) => {
                                const newDate = new Date(publishDate);
                                newDate.setDate(parseInt(e.target.value));
                                setPublishDate(newDate);
                                setPublishSchedule('scheduled');
                              }}
                              className="px-2 py-1 text-xs border border-gray-300 rounded"
                            >
                              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day}>
                                  {day.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                            <select
                              value={publishDate.getMonth()}
                              onChange={(e) => {
                                const newDate = new Date(publishDate);
                                newDate.setMonth(parseInt(e.target.value));
                                setPublishDate(newDate);
                                setPublishSchedule('scheduled');
                              }}
                              className="px-2 py-1 text-xs border border-gray-300 rounded"
                            >
                              {[
                                'Jan',
                                'Feb',
                                'Mar',
                                'Apr',
                                'May',
                                'Jun',
                                'Jul',
                                'Aug',
                                'Sep',
                                'Oct',
                                'Nov',
                                'Dec',
                              ].map((month, idx) => (
                                <option key={idx} value={idx}>
                                  {month}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              value={publishDate.getFullYear()}
                              onChange={(e) => {
                                const newDate = new Date(publishDate);
                                newDate.setFullYear(parseInt(e.target.value));
                                setPublishDate(newDate);
                                setPublishSchedule('scheduled');
                              }}
                              className="px-2 py-1 text-xs border border-gray-300 rounded"
                              min="2000"
                              max="2100"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={publishDate.getHours() % 12 || 12}
                              onChange={(e) => {
                                const newDate = new Date(publishDate);
                                const hour = parseInt(e.target.value);
                                const isPM = publishDate.getHours() >= 12;
                                newDate.setHours(
                                  isPM ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour,
                                );
                                setPublishDate(newDate);
                                setPublishSchedule('scheduled');
                              }}
                              className="px-2 py-1 text-xs border border-gray-300 rounded"
                              min="1"
                              max="12"
                              placeholder="HH"
                            />
                            <input
                              type="number"
                              value={publishDate.getMinutes()}
                              onChange={(e) => {
                                const newDate = new Date(publishDate);
                                newDate.setMinutes(parseInt(e.target.value));
                                setPublishDate(newDate);
                                setPublishSchedule('scheduled');
                              }}
                              className="px-2 py-1 text-xs border border-gray-300 rounded"
                              min="0"
                              max="59"
                              placeholder="MM"
                            />
                            <select
                              value={publishDate.getHours() >= 12 ? 'PM' : 'AM'}
                              onChange={(e) => {
                                const newDate = new Date(publishDate);
                                const currentHour = publishDate.getHours();
                                const hour12 = currentHour % 12 || 12;
                                if (e.target.value === 'PM') {
                                  newDate.setHours(hour12 === 12 ? 12 : hour12 + 12);
                                } else {
                                  newDate.setHours(hour12 === 12 ? 0 : hour12);
                                }
                                setPublishDate(newDate);
                                setPublishSchedule('scheduled');
                              }}
                              className="px-2 py-1 text-xs border border-gray-300 rounded"
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setShowPublishEdit(false)}
                              className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                              OK
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowPublishEdit(false);
                                setPublishSchedule('immediately');
                                setPublishDate(new Date());
                              }}
                              className="px-2 py-1 text-xs text-gray-700 hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-700 rounded shadow hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="border border-gray-300 bg-white">
              <div className="px-4 py-3 border-b border-gray-300 bg-gray-50 text-sm font-semibold">
                <span>Categories</span>
              </div>
              <div className="px-4 py-3">
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 -mx-1 px-1 py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={category.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCategory([...category, cat]);
                          } else {
                            setCategory(category.filter((c) => c !== cat));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>

                {/* Add Category Form */}
                {showAddCategory ? (
                  <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-300">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      New Category Name
                    </label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Add Category
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelAddCategory}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(true)}
                    className="mt-3 text-xs text-blue-600 hover:underline"
                  >
                    + Add Category
                  </button>
                )}
              </div>
            </div>

            {/* Author */}
            <div className="border border-gray-300 bg-white">
              <div className="px-4 py-3 border-b border-gray-300 bg-gray-50 text-sm font-semibold">
                <span>Author</span>
              </div>
              <div className="px-4 py-3">
                <div className="relative">
                  <select
                    value={session?.user?.name || session?.user?.email || ''}
                    className="w-full px-3 py-2 pr-8 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    disabled
                  >
                    <option value={session?.user?.name || session?.user?.email || ''}>
                      {session?.user?.name || session?.user?.email || 'Admin'} (online)
                    </option>
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="border border-gray-300 bg-white">
              <div className="px-4 py-3 border-b border-gray-300 bg-gray-50 text-sm font-semibold">
                <span>Featured image</span>
              </div>
              <div className="px-4 py-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                  className="hidden"
                  id="featured-image"
                />
                {!featuredImage ? (
                  <label
                    htmlFor="featured-image"
                    className="block text-center text-xs font-extrabold text-blue-600 hover:underline cursor-pointer"
                  >
                    Set featured image
                  </label>
                ) : (
                  <div>
                    <div className="relative w-full h-32 mb-2">
                      <Image
                        src={URL.createObjectURL(featuredImage)}
                        alt="Featured"
                        fill
                        className="object-cover rounded border border-gray-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage(null)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove featured image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
