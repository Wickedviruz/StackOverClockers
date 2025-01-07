import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getThreadDetails, createComment } from '../../services/api';

const ThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<any>(null);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const fetchedThread = await getThreadDetails(Number(threadId));
        setThread(fetchedThread);
      } catch (error) {
        console.error('Failed to fetch thread:', error);
      }
    };

    fetchThread();
  }, [threadId]);

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) {
      alert('Comment content is required');
      return;
    }

    setLoading(true);
    try {
      await createComment(Number(threadId), commentContent);
      alert('Comment added successfully');
      setCommentContent('');
      // Refresh thread details to include the new comment
      const updatedThread = await getThreadDetails(Number(threadId));
      setThread(updatedThread);
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('Failed to add comment.');
    } finally {
      setLoading(false);
    }
  };

  if (!thread) {
    return(
      <div className="min-h-screen bg-[#EDECEB] dark:bg-[#101010] text-gray-900 dark:text-gray-100 flex items-center justify-center">
        <p>Loading thread...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#101010] text-gray-900 dark:text-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">{thread.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Posted by {thread.author.username} on {new Date(thread.created_at).toLocaleString()}
        </p>
        <div className="my-6 bg-white dark:bg-[#1C1C1C] p-4 rounded shadow">
          {thread.content}
        </div>
        <h2 className="text-2xl font-bold mt-8">Comments</h2>
        <div className="space-y-4 mt-4">
          {thread.comments.length > 0 ? (
            thread.comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-200 dark:bg-[#2C2C2C] p-3 rounded">
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500">
                  {comment.author.username} - {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No comments yet</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Add a Comment</h3>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#474747] dark:border-[#3B3B3B] dark:bg-[#1C1C1C] dark:focus:ring-white dark:text-white"
            rows={4}
            placeholder="Write your comment here..."
          />
          <button
            onClick={handleCommentSubmit}
            disabled={loading}
            className="px-2 py-1 bg-[#D26000] text-white rounded hover:bg-[#FF7505] focus:outline-none focus:ring-2 focus:ring-[#FF7505]"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadPage;
