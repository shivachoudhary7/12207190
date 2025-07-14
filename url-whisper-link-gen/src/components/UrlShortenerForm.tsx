import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Link2, Clock, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UrlEntry {
  id: string;
  url: string;
  validity: string;
  shortcode: string;
  shortLink?: string;
  expiry?: string;
  isValid: boolean;
  urlError?: string;
  validityError?: string;
  shortcodeError?: string;
}

interface UrlShortenerFormProps {
  onUrlsShortened: (urls: UrlEntry[]) => void;
}

export function UrlShortenerForm({ onUrlsShortened }: UrlShortenerFormProps) {
  const { toast } = useToast();
  const [urls, setUrls] = useState<UrlEntry[]>([
    {
      id: "1",
      url: "",
      validity: "30",
      shortcode: "",
      isValid: false,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateUrl = (url: string): string | undefined => {
    if (!url) return "URL is required";
    
    try {
      new URL(url);
      return undefined;
    } catch {
      return "Please enter a valid URL";
    }
  };

  const validateValidity = (validity: string): string | undefined => {
    if (!validity) return undefined; // Optional field
    
    const num = parseInt(validity);
    if (isNaN(num) || num <= 0) {
      return "Please enter a positive number";
    }
    return undefined;
  };

  const validateShortcode = (shortcode: string): string | undefined => {
    if (!shortcode) return undefined; // Optional field
    
    if (shortcode.length < 3 || shortcode.length > 20) {
      return "Shortcode must be 3-20 characters";
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
      return "Shortcode must be alphanumeric";
    }
    
    return undefined;
  };

  const validateEntry = (entry: UrlEntry): UrlEntry => {
    const urlError = validateUrl(entry.url);
    const validityError = validateValidity(entry.validity);
    const shortcodeError = validateShortcode(entry.shortcode);
    
    return {
      ...entry,
      urlError,
      validityError,
      shortcodeError,
      isValid: !urlError && !validityError && !shortcodeError,
    };
  };

  const updateUrl = (id: string, field: keyof UrlEntry, value: string) => {
    setUrls(prev =>
      prev.map(url =>
        url.id === id
          ? validateEntry({ ...url, [field]: value })
          : url
      )
    );
  };

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          url: "",
          validity: "30",
          shortcode: "",
          isValid: false,
        },
      ]);
    }
  };

  const removeUrl = (id: string) => {
    if (urls.length > 1) {
      setUrls(prev => prev.filter(url => url.id !== id));
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Short URL copied to clipboard",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    const validUrls = urls.filter(url => url.url && url.isValid);
    
    if (validUrls.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please enter at least one valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      const shortenedUrls = validUrls.map(url => ({
        ...url,
        shortLink: `https://localhost:3000/${url.shortcode || `short${url.id}`}`,
        expiry: new Date(Date.now() + (parseInt(url.validity || "30") * 60 * 1000)).toISOString(),
      }));

      setUrls(prev =>
        prev.map(url => {
          const shortened = shortenedUrls.find(s => s.id === url.id);
          return shortened || url;
        })
      );

      onUrlsShortened(shortenedUrls);

      toast({
        title: "Success!",
        description: `${shortenedUrls.length} URL(s) shortened successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URLs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validUrlCount = urls.filter(url => url.url && url.isValid).length;

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          Shorten URLs
          <Badge variant="secondary" className="ml-auto">
            {urls.length}/5
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {urls.map((urlEntry, index) => (
          <Card key={urlEntry.id} className="p-4 bg-accent/30">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">URL {index + 1}</Badge>
                {urls.length > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeUrl(urlEntry.id)}
                    className="ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div>
                <Label htmlFor={`url-${urlEntry.id}`}>
                  Original URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`url-${urlEntry.id}`}
                  placeholder="https://example.com/very-long-url..."
                  value={urlEntry.url}
                  onChange={(e) => updateUrl(urlEntry.id, "url", e.target.value)}
                  className={urlEntry.urlError ? "border-destructive" : ""}
                />
                {urlEntry.urlError && (
                  <p className="text-sm text-destructive mt-1">{urlEntry.urlError}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`validity-${urlEntry.id}`}>
                    Validity (minutes)
                  </Label>
                  <Input
                    id={`validity-${urlEntry.id}`}
                    type="number"
                    placeholder="30"
                    value={urlEntry.validity}
                    onChange={(e) => updateUrl(urlEntry.id, "validity", e.target.value)}
                    className={urlEntry.validityError ? "border-destructive" : ""}
                  />
                  {urlEntry.validityError && (
                    <p className="text-sm text-destructive mt-1">{urlEntry.validityError}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`shortcode-${urlEntry.id}`}>
                    Custom Shortcode (optional)
                  </Label>
                  <Input
                    id={`shortcode-${urlEntry.id}`}
                    placeholder="mylink123"
                    value={urlEntry.shortcode}
                    onChange={(e) => updateUrl(urlEntry.id, "shortcode", e.target.value)}
                    className={urlEntry.shortcodeError ? "border-destructive" : ""}
                  />
                  {urlEntry.shortcodeError && (
                    <p className="text-sm text-destructive mt-1">{urlEntry.shortcodeError}</p>
                  )}
                </div>
              </div>

              {urlEntry.shortLink && (
                <Card className="p-3 bg-gradient-accent border-primary/20">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Shortened Successfully</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-background/50 p-2 rounded border">
                        {urlEntry.shortLink}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(urlEntry.shortLink!)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Expires: {new Date(urlEntry.expiry!).toLocaleString()}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        ))}

        <div className="flex flex-col sm:flex-row gap-3">
          {urls.length < 5 && (
            <Button
              variant="outline"
              onClick={addUrl}
              className="flex items-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              Add Another URL
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            disabled={validUrlCount === 0 || isSubmitting}
            className="bg-gradient-primary shadow-glow hover:shadow-lg ml-auto"
          >
            {isSubmitting ? "Shortening..." : `Shorten ${validUrlCount} URL${validUrlCount !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}