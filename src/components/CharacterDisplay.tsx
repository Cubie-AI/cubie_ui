import { ScrollArea } from "@/components/ui/scroll-area";

interface CharacterDisplayProps {
  character: string | null;
}

export function CharacterDisplay({ character }: CharacterDisplayProps) {
  if (!character) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No character description available.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[60vh] w-full rounded-md">
      <div className="text-sm text-muted-foreground whitespace-pre-line p-4">
        {character}
      </div>
    </ScrollArea>
  );
}
