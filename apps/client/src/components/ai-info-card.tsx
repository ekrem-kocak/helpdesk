import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, Separator } from '@helpdesk/shared/ui';

type AIInfoCardVariant = 'summary' | 'solution';

interface AIInfoCardProps {
  variant: AIInfoCardVariant;
  content: string;
}

const variantConfig = {
  summary: {
    colors: {
      border: 'border-purple-200 dark:border-purple-900/50',
      background: 'bg-purple-50/30 dark:bg-purple-950/10',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
      separator: 'bg-purple-200/50 dark:bg-purple-900/50',
    },
    title: 'AI Summary',
    description: 'Quick overview for support team',
  },
  solution: {
    colors: {
      border: 'border-blue-200 dark:border-blue-900/50',
      background: 'bg-blue-50/30 dark:bg-blue-950/10',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
      separator: 'bg-blue-200/50 dark:bg-blue-900/50',
    },
    title: 'Suggested Solution',
    description: 'Try this while waiting for support',
  },
} as const;

export function AIInfoCard({ variant, content }: AIInfoCardProps) {
  const config = variantConfig[variant];

  return (
    <Card className={`${config.colors.border} ${config.colors.background}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-2">
            <div className={`rounded-md ${config.colors.iconBg} p-1.5`}>
              <Sparkles className={`h-4 w-4 ${config.colors.iconColor}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{config.title}</h3>
              <p className="text-muted-foreground text-xs">
                {config.description}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator className={config.colors.separator} />
      <CardContent className="pt-3">
        <p className="text-sm leading-relaxed break-words">{content}</p>
      </CardContent>
    </Card>
  );
}
