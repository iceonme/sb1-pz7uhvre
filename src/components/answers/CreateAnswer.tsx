import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { createAnswer } from '@/api/answers';
import { toast } from '../ui/use-toast';
import { showRewardToast } from '../ui/reward-toast';

interface CreateAnswerProps {
  questionId: string;
  onSuccess: () => void;
}

export function CreateAnswer({ questionId, onSuccess }: CreateAnswerProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createAnswer({
        question_id: questionId,
        content,
      });
      setContent('');
      // First show the reward toast
      showRewardToast({
        title: "回答已发布",
        amount: 10
      });
      // Then immediately refresh the answer list
      onSuccess();
    } catch (error) {
      toast({
        title: "发布失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-32 px-3 py-2 bg-secondary rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-mars-sky resize-none"
        placeholder="写下你的回答..."
        required
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-mars-sky hover:bg-mars-sky/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? '发布中...' : '发布回答'}
        </Button>
      </div>
    </form>
  );
}