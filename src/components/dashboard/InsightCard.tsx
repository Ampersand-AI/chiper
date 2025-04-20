
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Insight } from '@/data/mockData';
import { CalendarDays, Info } from 'lucide-react';

const sentimentColors = {
  positive: 'bg-green-100 text-green-800 hover:bg-green-200',
  negative: 'bg-red-100 text-red-800 hover:bg-red-200',
  neutral: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
};

const impactColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const typeIcons = {
  product: '🚀',
  hiring: '👥',
  expansion: '🌐',
  pricing: '💰',
  news: '📰',
};

interface InsightCardProps {
  insight: Insight;
  competitorName: string;
}

export function InsightCard({ insight, competitorName }: InsightCardProps) {
  return (
    <Card className="insight-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">
            <span className="mr-2">{typeIcons[insight.type]}</span>
            {insight.title}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={sentimentColors[insight.sentiment]}>
                  {insight.sentiment}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sentiment analysis score</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          <span className="mr-1 font-medium">{competitorName}</span>
          <span className="mx-1">•</span>
          <span className="overflow-hidden text-ellipsis">{insight.source}</span>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm">{insight.description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3 mr-1" />
          {insight.date}
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`${impactColors[insight.impact]} text-xs ml-2`}>
                {insight.impact} impact
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Estimated business impact</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
