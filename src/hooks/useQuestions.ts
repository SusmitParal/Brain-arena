import { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';
import { fetchQuestions } from '../services/geminiService';

export const useQuestions = (difficulty: string, language: string, count: number) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getQuestions = useCallback(async (seenIds: string[] = []) => {
    try {
      setLoading(true);
      const newQuestions = await fetchQuestions(difficulty, language, count, seenIds);
      setQuestions(newQuestions);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [difficulty, language, count]);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  return { questions, loading, error, refresh: getQuestions };
};
