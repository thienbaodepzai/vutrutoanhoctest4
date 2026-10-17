import { supabase, isSupabaseConfigured } from './supabase';

export interface LearningResultRecord {
  id?: string;
  user_id: string;
  lesson_id: string;
  lesson_title: string;
  grade_level: number;
  topic: string;
  score: number;
  correct_count: number;
  wrong_count: number;
  completion_percent: number;
  answers?: any;
  completed_at: string;
}

export interface LearningProgressRecord {
  id?: string;
  user_id: string;
  lesson_id: string;
  lesson_title?: string;
  grade_level?: number;
  topic?: string;
  current_question: number;
  answers?: any;
  progress_percent: number;
  status: 'in_progress' | 'completed';
  updated_at: string;
}

export async function saveLearningResult(record: Omit<LearningResultRecord, 'id'>) {
  if (!isSupabaseConfigured) return { error: null, data: null };
  try {
    const { data, error } = await supabase
      .from('learning_results')
      .insert([record])
      .select();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function upsertLearningProgress(record: Omit<LearningProgressRecord, 'id'>) {
  if (!isSupabaseConfigured) return { error: null, data: null };
  try {
    const { data, error } = await supabase
      .from('learning_progress')
      .upsert([record], { onConflict: 'user_id,lesson_id' })
      .select();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function fetchUserLearningResults(userId: string) {
  if (!isSupabaseConfigured) return { data: [], error: null };
  try {
    const { data, error } = await supabase
      .from('learning_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    return { data: data || [], error };
  } catch (err: any) {
    return { data: [], error: err };
  }
}

export async function fetchUserLearningProgress(userId: string) {
  if (!isSupabaseConfigured) return { data: [], error: null };
  try {
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    return { data: data || [], error };
  } catch (err: any) {
    return { data: [], error: err };
  }
}
