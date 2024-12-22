import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { 
  ChatBubbleLeftIcon, 
  UserGroupIcon, 
  ArrowUpIcon, 
  BeakerIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { QuestionStatusBadge } from './QuestionStatusBadge';
import type { Question } from '@/types/question';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-300 
        hover:bg-secondary/80 hover:shadow-lg hover:-translate-y-0.5
        ${isExpanded ? 'bg-secondary/50' : 'bg-card'}
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`transition-all duration-300 ${isExpanded ? 'opacity-0 h-0' : 'opacity-100'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <h3 className="font-medium truncate">{question.title}</h3>
            <QuestionStatusBadge status={question.status} />
          </div>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(question.created_at), {
                addSuffix: true,
                locale: zhCN
              })}
            </span>
            <span className="flex items-center">
              <UserIcon className="w-4 h-4 mr-1" />
              {question.researcher_count}
            </span>
            <span className="flex items-center">
              <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
              {question.discussion_count}
            </span>
          </div>
        </div>
      </div>

      <div 
        className={`transition-all duration-300 ${
          isExpanded ? 'animate-expand' : 'animate-collapse opacity-0 absolute'
        }`}
      >
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {question.title}
            <QuestionStatusBadge status={question.status} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 mb-4">{question.content}</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-secondary/80 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-mars-sky mb-2">
                <BeakerIcon className="w-5 h-5" />
                <span className="font-medium">研究计划</span>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{question.researcher_count} 位研究者</p>
              </div>
            </div>
            
            <div className="p-3 bg-secondary/80 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-mars-dust mb-2">
                <ChatBubbleLeftIcon className="w-5 h-5" />
                <span className="font-medium">讨论</span>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{question.discussion_count} 条讨论</p>
              </div>
            </div>
            
            <div className="p-3 bg-secondary/80 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-mars-surface mb-2">
                <ArrowUpIcon className="w-5 h-5" />
                <span className="font-medium">投票</span>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{question.vote_count} 票</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <UserGroupIcon className="w-4 h-4" />
              {question.researcher_count} 研究者
            </span>
          </div>
          <span className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" />
            {formatDistanceToNow(new Date(question.created_at), { 
              addSuffix: true,
              locale: zhCN 
            })}
          </span>
        </CardFooter>
      </div>
    </Card>
  );
}