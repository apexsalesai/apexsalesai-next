import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { GridSection as GridSectionType } from '@/lib/schemas';

export const GridSection: React.FC<GridSectionType> = ({
  title,
  description,
  items,
  columns = 3,
}) => {
  const gridClass =
    columns === 2
      ? 'md:grid-cols-2'
      : columns === 3
      ? 'md:grid-cols-2 lg:grid-cols-3'
      : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        <div className={`grid gap-8 ${gridClass}`}>
          {items.map((item, index) => {
            const cardContent = (
              <Card hover={!!item.href}>
                <CardHeader>
                  {item.badge && <Badge className="mb-2">{item.badge}</Badge>}
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
                {item.tags && item.tags.length > 0 && (
                  <CardFooter className="flex-wrap">
                    {item.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </CardFooter>
                )}
              </Card>
            );

            if (item.href) {
              return (
                <Link key={index} href={item.href}>
                  {cardContent}
                </Link>
              );
            }

            return <div key={index}>{cardContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
};
