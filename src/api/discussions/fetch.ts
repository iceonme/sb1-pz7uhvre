import { supabase } from '@/lib/supabase';
import { handleError } from '@/utils/error-handler';
import type { Discussion } from '@/types/discussion';
import type { DiscussionResponse } from '@/types/database';

export async function fetchDiscussions(questionId: string): Promise<Discussion[]> {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select(`
        id,
        question_id,
        content,
        created_at,
        author_id,
        reply_count,
        author:profiles!discussions_author_id_fkey (
          username
        ),
        replies:discussion_replies (
          id,
          content,
          created_at,
          author:profiles!discussion_replies_author_id_fkey (
            username
          )
        )
      `)
      .eq('question_id', questionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data as DiscussionResponse[]).map(discussion => ({
      id: discussion.id,
      question_id: discussion.question_id,
      author_id: discussion.author_id,
      content: discussion.content,
      created_at: discussion.created_at,
      reply_count: discussion.reply_count,
      author: {
        username: discussion.author.username
      },
      replies: discussion.replies.map(reply => ({
        id: reply.id,
        discussion_id: discussion.id,
        author_id: discussion.author_id,
        content: reply.content,
        created_at: reply.created_at,
        author: {
          username: reply.author.username
        }
      }))
    }));
  } catch (error) {
    throw handleError(error);
  }
}