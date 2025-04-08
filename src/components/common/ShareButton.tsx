
import { shareContent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const ShareButton = ({ 
  title, 
  text, 
  variant = "outline", 
  size = "default",
  className
}: ShareButtonProps) => {
  const handleShare = async () => {
    await shareContent(title, text);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  );
};

export default ShareButton;
