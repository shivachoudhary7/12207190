import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  ExternalLink, 
  Calendar, 
  Clock, 
  MousePointer, 
  Globe,
  Eye,
  RefreshCw
} from "lucide-react";

// Mock data for demonstration
const mockStatistics = [
  {
    id: "1",
    shortLink: "https://localhost:3000/short1",
    originalUrl: "https://very-very-very-long-and-descriptive-subdomain.example.com/path",
    shortcode: "short1",
    createdAt: "2025-01-13T10:30:00Z",
    expiresAt: "2025-01-13T11:00:00Z",
    totalClicks: 15,
    clicks: [
      {
        timestamp: "2025-01-13T10:35:00Z",
        referrer: "Direct",
        location: "New York, US",
        userAgent: "Chrome/120.0"
      },
      {
        timestamp: "2025-01-13T10:42:00Z",
        referrer: "Twitter",
        location: "London, UK",
        userAgent: "Safari/17.0"
      },
      {
        timestamp: "2025-01-13T10:45:00Z",
        referrer: "Direct",
        location: "Toronto, CA",
        userAgent: "Firefox/120.0"
      }
    ]
  },
  {
    id: "2",
    shortLink: "https://localhost:3000/demo123",
    originalUrl: "https://github.com/user/repository/blob/main/README.md",
    shortcode: "demo123",
    createdAt: "2025-01-13T09:15:00Z",
    expiresAt: "2025-01-13T10:15:00Z",
    totalClicks: 8,
    clicks: [
      {
        timestamp: "2025-01-13T09:20:00Z",
        referrer: "LinkedIn",
        location: "San Francisco, US",
        userAgent: "Chrome/120.0"
      },
      {
        timestamp: "2025-01-13T09:35:00Z",
        referrer: "Direct",
        location: "Berlin, DE",
        userAgent: "Edge/120.0"
      }
    ]
  }
];

export default function Statistics() {
  const [refreshing, setRefreshing] = useState(false);
  const [statistics] = useState(mockStatistics);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  const getStatusBadge = (expiresAt: string) => {
    const expired = isExpired(expiresAt);
    return (
      <Badge variant={expired ? "destructive" : "default"}>
        {expired ? "Expired" : "Active"}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">URL Statistics</h2>
            <p className="text-muted-foreground">
              View analytics for your shortened URLs
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6">
          {statistics.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No URLs Yet</h3>
                <p className="text-muted-foreground">
                  Start by creating some shortened URLs to see statistics here.
                </p>
              </CardContent>
            </Card>
          ) : (
            statistics.map((stat) => (
              <Card key={stat.id} className="shadow-elegant">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ExternalLink className="w-5 h-5 text-primary" />
                        {stat.shortcode}
                        {getStatusBadge(stat.expiresAt)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground font-mono break-all">
                        {stat.shortLink}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold">
                        <Eye className="w-4 h-4" />
                        {stat.totalClicks}
                      </div>
                      <p className="text-xs text-muted-foreground">total clicks</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Original URL */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Original URL</h4>
                    <code className="block text-sm bg-muted p-3 rounded border break-all">
                      {stat.originalUrl}
                    </code>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(stat.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Expires:</span>
                      <span className={isExpired(stat.expiresAt) ? "text-destructive" : ""}>
                        {new Date(stat.expiresAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Click Details */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <MousePointer className="w-4 h-4" />
                      Click Details
                    </h4>
                    
                    {stat.clicks.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        No clicks recorded yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {stat.clicks.map((click, index) => (
                          <Card key={index} className="p-3 bg-accent/30">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="font-mono">
                                  {new Date(click.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                <span>
                                  {click.referrer === "Direct" ? (
                                    <Badge variant="outline" className="text-xs">
                                      Direct
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">
                                      {click.referrer}
                                    </Badge>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {click.location}
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}