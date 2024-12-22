import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useAuth } from '@/contexts/AuthContext';

interface VoteSectionProps {
  questionId: string;
}

export function VoteSection({ questionId }: VoteSectionProps) {
  const { user } = useAuth();

  // 模拟数据
  const votes = [
    {
      id: '1',
      title: '最佳土壤改良方案投票',
      options: [
        { id: '1', name: '生物酶处理', votes: 156 },
        { id: '2', name: '微生物培育', votes: 89 },
        { id: '3', name: '化学处理', votes: 45 },
      ],
      total_votes: 290,
      end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>投票</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {votes.map((vote) => (
          <div key={vote.id} className="space-y-4">
            <h3 className="font-medium">{vote.title}</h3>
            <div className="space-y-4">
              {vote.options.map((option) => {
                const percentage = (option.votes / vote.total_votes) * 100;
                
                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{option.name}</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} />
                    {user && (
                      <Button variant="outline" size="sm" className="w-full">
                        投票
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              总投票数：{vote.total_votes}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}