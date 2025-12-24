import { useState, useRef } from "react";
import { Star, ThumbsUp, User, Image as ImageIcon, Video, X, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { toast } from "sonner";

interface ReviewMedia {
  type: 'image' | 'video';
  url: string;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  media?: ReviewMedia[];
}

interface ReviewSectionProps {
  productId: number;
  productName: string;
}

// Mock reviews data - Verified tag comes from backend based on purchase history
const mockReviews: Review[] = [
  {
    id: 1,
    author: "Priya S.",
    rating: 5,
    date: "2024-01-15",
    title: "Absolutely Divine!",
    content: "This candle exceeded my expectations. The scent fills my entire living room without being overwhelming. Burns evenly and lasts forever. Will definitely purchase again!",
    helpful: 24,
    verified: true, // Backend sets this when user has purchased the product
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=200&h=200&fit=crop' },
    ],
  },
  {
    id: 2,
    author: "Rahul M.",
    rating: 4,
    date: "2024-01-10",
    title: "Great Quality, Beautiful Packaging",
    content: "Bought this as a gift and the recipient loved it. The packaging is premium and the scent is subtle but pleasant. Removed one star because shipping took a bit longer than expected.",
    helpful: 12,
    verified: true,
  },
  {
    id: 3,
    author: "Ananya K.",
    rating: 5,
    date: "2024-01-05",
    title: "My New Favorite!",
    content: "I've tried many luxury candles and this one stands out. The fragrance notes are perfectly balanced. I use it during my evening meditation sessions.",
    helpful: 18,
    verified: true,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&h=200&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop' },
    ],
  },
];

const StarRating = ({
  rating,
  interactive = false,
  onRatingChange,
  size = "sm",
}: {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "lg";
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          className={cn(
            "transition-colors",
            interactive && "cursor-pointer hover:scale-110"
          )}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          <Star
            className={cn(
              size === "sm" ? "h-4 w-4" : "h-6 w-6",
              (hoverRating || rating) >= star
                ? "fill-primary text-primary"
                : "text-border"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export const ReviewSection = ({ productId, productName }: ReviewSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    title: "",
    content: "",
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [helpfulClicked, setHelpfulClicked] = useState<number[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const averageRating =
    mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to the backend with media files
    toast.success("Review submitted!", {
      description: "Your review will be visible after moderation.",
    });
    setShowForm(false);
    setNewReview({ name: "", rating: 0, title: "", content: "" });
    setMediaFiles([]);
  };

  const handleHelpful = (reviewId: number) => {
    if (!helpfulClicked.includes(reviewId)) {
      setHelpfulClicked([...helpfulClicked, reviewId]);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      if (type === 'image' && mediaFiles.length + newFiles.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      if (type === 'video' && newFiles.length > 1) {
        toast.error("Maximum 1 video allowed");
        return;
      }
      setMediaFiles([...mediaFiles, ...newFiles]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  return (
    <section className="py-16 border-t border-border/30">
      <div className="container mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl text-foreground mb-2">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-4">
                <StarRating rating={Math.round(averageRating)} />
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} out of 5 ({mockReviews.length} reviews)
                </span>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Write a Review"}
            </Button>
          </div>
        </ScrollReveal>

        {/* Review Form */}
        {showForm && (
          <ScrollReveal>
            <form
              onSubmit={handleSubmit}
              className="bg-secondary/20 border border-border/30 p-6 mb-12 space-y-6"
            >
              <h3 className="font-display text-xl text-foreground">
                Write a Review for {productName}
              </h3>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Your Rating *
                </label>
                <StarRating
                  rating={newReview.rating}
                  interactive
                  onRatingChange={(rating) =>
                    setNewReview({ ...newReview, rating })
                  }
                  size="lg"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Your Name *
                  </label>
                  <Input
                    value={newReview.name}
                    onChange={(e) =>
                      setNewReview({ ...newReview, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Review Title *
                  </label>
                  <Input
                    value={newReview.title}
                    onChange={(e) =>
                      setNewReview({ ...newReview, title: e.target.value })
                    }
                    placeholder="Summarize your experience"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Your Review *
                </label>
                <Textarea
                  value={newReview.content}
                  onChange={(e) =>
                    setNewReview({ ...newReview, content: e.target.value })
                  }
                  placeholder="Share your experience with this product..."
                  rows={4}
                  required
                />
              </div>

              {/* Media Upload */}
              <div>
                <label className="text-sm text-muted-foreground block mb-3">
                  Add Photos or Video (optional)
                </label>
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    multiple
                    onChange={(e) => handleMediaUpload(e, 'image')}
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/*"
                    onChange={(e) => handleMediaUpload(e, 'video')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    className="gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Add Images
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Add Video
                  </Button>
                </div>
                {mediaFiles.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="relative w-16 h-16 bg-secondary/30 border border-border/30 rounded overflow-hidden">
                        {file.type.startsWith('image') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-2">
                  Max 5 images, 1 video. Verified tag is added automatically for customers who purchased this product.
                </p>
              </div>

              <Button type="submit" disabled={newReview.rating === 0}>
                Submit Review
              </Button>
            </form>
          </ScrollReveal>
        )}

        {/* Reviews List */}
        <div className="space-y-8">
          {mockReviews.map((review, index) => (
            <ScrollReveal key={review.id} delay={index * 100}>
              <div className="border-b border-border/30 pb-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {review.author}
                        </span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5">
                            <BadgeCheck className="h-3 w-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>

                <h4 className="font-medium text-foreground mb-2">
                  {review.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {review.content}
                </p>

                {/* Review Media */}
                {review.media && review.media.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {review.media.map((media, idx) => (
                      <div key={idx} className="w-16 h-16 rounded overflow-hidden bg-secondary/30">
                        {media.type === 'image' ? (
                          <img src={media.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <video src={media.url} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleHelpful(review.id)}
                  className={cn(
                    "flex items-center gap-2 text-xs transition-colors",
                    helpfulClicked.includes(review.id)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  disabled={helpfulClicked.includes(review.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful + (helpfulClicked.includes(review.id) ? 1 : 0)})
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
