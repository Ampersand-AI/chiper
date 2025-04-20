
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Generate a random number between min and max (inclusive)
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random data point for demo purposes
export const getRandomDataPoint = (min: number, max: number): number => {
  return getRandomNumber(min, max);
};

// Generate random chart data series
export const generateChartData = (days: number, minValue: number, maxValue: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - 1 - i));
    
    data.push({
      date: formatDate(date),
      value: getRandomDataPoint(minValue, maxValue)
    });
  }
  
  return data;
};

export const getCompetitorColor = (competitorId: number): string => {
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    '#4C9AFF',
    '#FF8660',
    '#6CCB94',
    '#FCC16A',
    '#B888F8',
  ];
  
  return colors[competitorId % colors.length];
};
