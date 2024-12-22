import { supabase } from '../lib/supabase';
import { handleError } from '../utils/error-handler';
import type { Answer, Comment, CreateAnswerInput, CreateCommentInput } from '../types/answer';

export async function fetchAnswers(questionId: string): Promise<Answer[]> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    const { data, error } = await supabase
      .from('answers')
      .select(`
        *,
        author:profiles!answers_author_id_fkey (
          id,
          username,
          mars_balance
        ),
        likes_count,
        comments_count,
        has_liked:answer_likes!inner(user_id)
      `)
      .eq('question_id', questionId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(answer => ({
      ...answer,
      has_liked: user ? answer.has_liked.some((like: any) => like.user_id === user.id) : false
    }));
  } catch (error) {
    throw handleError(error);
  }
}

export async function createAnswer(input: CreateAnswerInput): Promise<void> {
  try {
    const { error } = await supabase
      .from('answers')
      .insert([{
        ...input,
        author_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}

export async function fetchComments(answerId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('answer_comments')
      .select(`
        *,
        author:profiles!answer_comments_author_id_fkey (
          id,
          username
        )
      `)
      .eq('answer_id', answerId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw handleError(error);
  }
}

export async function createComment(input: CreateCommentInput): Promise<void> {
  try {
    const { error } = await supabase
      .from('answer_comments')
      .insert([{
        ...input,
        author_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}

export async function likeAnswer(answerId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('like_answer', {
      answer_id: answerId
    });

    if (error) throw error;
  } catch (error) {
    throw handleError(error);
  }
}