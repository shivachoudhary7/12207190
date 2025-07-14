import { useState } from "react";
import { Layout } from "@/components/Layout";
import { UrlShortenerForm } from "@/components/UrlShortenerForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Shield, BarChart3 } from "lucide-react";

interface ShortenedUrl {
  id: string;
  url: string;
  shortLink: string;
  expiry: string;
}

const Index = () => {
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);

  const handleUrlsShortened = (urls: any[]) => {
    setShortenedUrls(prev => [...prev, ...urls]);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Transform Long URLs into Short, Powerful Links
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create up to 5 short URLs simultaneously with custom validity periods and shortcodes.
            Track every click with detailed analytics.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center bg-gradient-accent border-primary/20">
            <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Batch Processing</h3>
            <p className="text-sm text-muted-foreground">Shorten up to 5 URLs at once</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-accent border-primary/20">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Custom Validity</h3>
            <p className="text-sm text-muted-foreground">Set expiration times in minutes</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-accent border-primary/20">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Detailed Analytics</h3>
            <p className="text-sm text-muted-foreground">Track clicks and user locations</p>
          </Card>
        </div>

        {/* URL Shortener Form */}
        <UrlShortenerForm onUrlsShortened={handleUrlsShortened} />

        {/* Recent URLs */}
        {shortenedUrls.length > 0 && (
          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Recently Shortened URLs</h3>
                <Badge variant="secondary">{shortenedUrls.length}</Badge>
              </div>
              <div className="space-y-3">
                {shortenedUrls.slice(-3).map((url) => (
                  <div
                    key={url.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-accent/30 rounded border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{url.url}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {url.shortLink}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs w-fit">
                      Expires: {new Date(url.expiry).toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Index;
