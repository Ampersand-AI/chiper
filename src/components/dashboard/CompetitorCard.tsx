
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Competitor } from '@/types/competitors';
import { Button } from '@/components/ui/button';

interface CompetitorCardProps {
  competitor: Competitor;
  insightCount: number;
  onViewDetails?: () => void;  // Make this prop optional
}

export function CompetitorCard({ competitor, insightCount, onViewDetails }: CompetitorCardProps) {
  const sentimentColor = 
    competitor.sentimentScore >= 75 ? 'bg-green-100 text-green-800' :
    competitor.sentimentScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold">
              {competitor.name.charAt(0)}
            </div>
            <CardTitle className="text-lg">{competitor.name}</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={sentimentColor}>
                  {competitor.sentimentScore}/100
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sentiment score based on recent activity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="line-clamp-2">
          {competitor.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Market Position</span>
              <span className="font-medium">{competitor.industryPositioning}</span>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Activity Level</span>
              <span className="text-xs">{insightCount} insights in 60 days</span>
            </div>
            <Progress value={(insightCount / 15) * 100} className="h-1" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(competitor.lastUpdated).toLocaleDateString()}
        </div>
        <Button variant="ghost" size="sm" asChild onClick={onViewDetails}>
          <Link to={`/competitors/${competitor.id}`} className="flex items-center">
            View details
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
