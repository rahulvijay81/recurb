"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);

  const fetchFeatures = () => {
    fetch("/api/admin/features")
      .then((res) => res.json())
      .then((data) => setFeatures(data.data || []));
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const toggleFeature = async (key: string, enabled: boolean) => {
    await fetch("/api/admin/features", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, enabled }),
    });
    fetchFeatures();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Feature Toggles</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.length === 0 ? (
              <p className="text-muted-foreground">No feature flags configured</p>
            ) : (
              features.map((feature) => (
                <div key={feature.key} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="font-medium">{feature.key}</div>
                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={(enabled) => toggleFeature(feature.key, enabled)}
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
