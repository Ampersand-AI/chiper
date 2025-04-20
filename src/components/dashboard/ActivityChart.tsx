
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getCompetitorColor } from '@/lib/utils';

interface ActivityData {
  id: number;
  name: string;
  data: Array<{
    date: string;
    value: number;
  }>;
}

interface ActivityChartProps {
  data: ActivityData[];
  title?: string;
  description?: string;
}

export function ActivityChart({ 
  data, 
  title = "Competitor Activity", 
  description = "Number of significant activities detected" 
}: ActivityChartProps) {
  // Combine all competitor data for the chart
  const combinedData = data[0].data.map((item) => {
    const result: any = { date: item.date };
    
    data.forEach((competitor) => {
      const matchingItem = competitor.data.find((d) => d.date === item.date);
      result[competitor.name] = matchingItem ? matchingItem.value : 0;
    });
    
    return result;
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={combinedData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
              minTickGap={30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        {label}
                      </div>
                      <div className="grid gap-1">
                        {payload.map((entry, index) => (
                          <div key={`item-${index}`} className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs font-medium">
                              {entry.name}: {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {data.map((competitor) => (
              <Line
                key={competitor.id}
                type="monotone"
                dataKey={competitor.name}
                strokeWidth={2}
                activeDot={{
                  r: 4,
                  style: { opacity: 0.8 },
                }}
                stroke={getCompetitorColor(competitor.id)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
