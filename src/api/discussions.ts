import { supabase } from '../lib/supabase';
import { handleError } from '../utils/error-handler';
import type { Discussion, CreateDiscussionInput, CreateReplyInput } from '../types/discussion';

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

    return (data || []).map(discussion => ({
      id: discussion.id,
      question_id: discussion.question_id,
      author_id: discussion.author_id,
      content: discussion.content,
      created_at: discussion.created_at,
      reply_count: discussion.reply_count,
      author: {
        username: discussion.author?.username || 'Unknown'
      },
      replies: (discussion.replies || []).map(reply => ({
        id: reply.id,
        discussion_id: discussion.id,
        author_id: discussion.author_id,
        content: reply.content,
        created_at: reply.created_at,
        author: {
          username: (reply.author as { username: string })?.username || 'Unknown'
        }
      }))
    }));
  } catch (error) {
    throw handleError(error);
  }
}

export async function createDiscussion(input: CreateDiscussionInput): Promise<void> {
  try {
    const { error } = await supabase
      .from('discussions')
      .insert([{
        ...input,
        author_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}

export async function createReply(input: CreateReplyInput): Promise<void> {
  try {
    const { error } = await supabase
      .from('discussion_replies')
      .insert([{
        ...input,
        author_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}