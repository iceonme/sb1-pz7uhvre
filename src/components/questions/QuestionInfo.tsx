import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { QuestionStatusBadge } from './QuestionStatusBadge';
import { ShareButton } from '../share/ShareButton';
import { 
  ChatBubbleLeftIcon, 
  UserGroupIcon, 
  ArrowUpIcon,
  BeakerIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import type { Question } from '@/types/question';

interface QuestionInfoProps {
  question: Question;
}

export function QuestionInfo({ question }: QuestionInfoProps) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{question.title}</CardTitle>
          <div className="flex items-center gap-4">
            <QuestionStatusBadge status={question.status} />
            <ShareButton questionId={question.id} title={question.title} />
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>提问时间：
            {formatDistanceToNow(new Date(question.created_at), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 问题内容 */}
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{question.content}</p>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 text-mars-sky mb-2">
              <BeakerIcon className="w-5 h-5" />
              <span className="font-medium">研究计划</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {question.researcher_count} 位研究者参与
            </p>
          </div>

          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 text-mars-dust mb-2">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="font-medium">讨论</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {question.discussion_count} 条讨论
            </p>
          </div>

          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 text-mars-surface mb-2">
              <DocumentTextIcon className="w-5 h-5" />
              <span className="font-medium">答案</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {question.vote_count} 票
            </p>
          </div>

          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <UserGroupIcon className="w-5 h-5" />
              <span className="font-medium">参与者</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {question.researcher_count + question.discussion_count} 人
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}