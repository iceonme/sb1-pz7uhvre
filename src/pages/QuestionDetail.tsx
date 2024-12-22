import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuestionDetail } from '@/hooks/useQuestionDetail';
import { QuestionInfo } from '../components/questions/QuestionInfo';
import { AnswerList } from '../components/answers/AnswerList';
import { CreateAnswer } from '../components/answers/CreateAnswer';
import { ResearchProposalList } from '../components/research/ResearchProposalList';
import { CreateResearchProposal } from '../components/research/CreateResearchProposal';
import { VoteSection } from '../components/votes/VoteSection';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { fetchAnswers } from '@/api/answers';
import { fetchResearchProposals } from '@/api/research';
import type { Answer } from '@/types/answer';
import type { ResearchProposal } from '@/types/research';

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const { question, loading, error } = useQuestionDetail(id!);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);

  const loadAnswers = async () => {
    if (!id) return;
    const data = await fetchAnswers(id);
    setAnswers(data);
  };

  const loadProposals = async () => {
    if (!id) return;
    const data = await fetchResearchProposals(id);
    setProposals(data);
  };

  useEffect(() => {
    loadAnswers();
    loadProposals();
  }, [id]);

  if (loading) {
    return <div className="space-y-8 animate-pulse">
      <Card className="h-64 bg-secondary" />
      <Card className="h-48 bg-secondary" />
      <Card className="h-96 bg-secondary" />
    </div>;
  }

  if (error || !question) {
    return <div className="text-destructive">加载问题详情失败</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 问题信息 */}
      <QuestionInfo question={question} />
      
      {/* 研究计划区域 */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-mars-night/80 to-mars-sky/10 backdrop-blur-sm border border-border/50">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="relative">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50">
            <CardTitle className="text-xl text-mars-sky">研究计划</CardTitle>
            <CreateResearchProposal 
              questionId={id!}
              onSuccess={loadProposals}
            />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ResearchProposalList proposals={proposals} />
            </div>
          </CardContent>
        </div>
      </div>

      {/* 回答区域 */}
      <Card className="bg-gradient-to-br from-secondary/80 to-background border-border/50">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-xl">回答 ({answers.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <CreateAnswer 
            questionId={id!}
            onSuccess={loadAnswers}
          />
          <AnswerList 
            answers={answers}
            onLike={loadAnswers}
          />
        </CardContent>
      </Card>

      {/* 投票区域 */}
      <VoteSection questionId={id!} />
    </div>
  );
}