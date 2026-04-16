"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { GA4Config, saveGA4Config } from "@/lib/storage";

interface GA4Property {
  name: string;
  displayName: string;
}

interface GA4SetupProps {
  userId: string;
  onComplete: (config: GA4Config) => void;
  onSkip?: () => void;
}

export default function GA4Setup({ userId, onComplete, onSkip }: GA4SetupProps) {
  const [properties, setProperties] = useState<GA4Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scopeMissing, setScopeMissing] = useState(false);
  const [apiNotEnabled, setApiNotEnabled] = useState<string | null>(null);

  const [selectedProperty, setSelectedProperty] = useState("");
  const [conversionEvent, setConversionEvent] = useState("sign_up");
  const [siteUrl, setSiteUrl] = useState("");
  const [signupValue, setSignupValue] = useState(50);

  useEffect(() => {
    fetch("/api/ga4/properties")
      .then(async (res) => {
        if (res.status === 403) {
          const body = await res.json();
          if (body.error === "scope_missing") {
            setScopeMissing(true);
            return;
          }
          if (body.error === "api_not_enabled") {
            setApiNotEnabled(body.detail);
            return;
          }
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || "Failed to load properties");
        }
        const data = await res.json();
        setProperties(data.properties || []);
        if (data.properties?.length > 0) {
          setSelectedProperty(data.properties[0].name);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProperty || !siteUrl) return;

    const config: GA4Config = {
      schemaVersion: 1,
      ga4PropertyId: selectedProperty,
      conversionEvent: conversionEvent || "sign_up",
      siteUrl: siteUrl.replace(/\/+$/, ""),
      signupValue: signupValue || 0,
    };

    saveGA4Config(userId, config);
    onComplete(config);
  }

  if (scopeMissing) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center max-w-lg mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Connect Google Analytics</h2>
        <p className="text-sm text-gray-600 mb-4">
          To see which keywords drive signups, we need access to your Google Analytics data.
          Click below to grant permission.
        </p>
        <button
          onClick={() => signIn("google")}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Grant Analytics Access
        </button>
        {onSkip && (
          <button onClick={onSkip} className="block mx-auto mt-3 text-xs text-gray-400 hover:text-gray-600">
            Skip for now
          </button>
        )}
      </div>
    );
  }

  if (apiNotEnabled) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center max-w-lg mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Enable GA4 Admin API</h2>
        <p className="text-sm text-gray-600 mb-4">
          The Google Analytics Admin API needs to be enabled in your Google Cloud project.
        </p>
        <a
          href="https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Enable API in Cloud Console
        </a>
        {onSkip && (
          <button onClick={onSkip} className="block mx-auto mt-3 text-xs text-gray-400 hover:text-gray-600">
            Skip for now
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center max-w-lg mx-auto">
        <p className="text-sm text-red-600">{error}</p>
        {onSkip && (
          <button onClick={onSkip} className="block mx-auto mt-3 text-xs text-gray-400 hover:text-gray-600">
            Skip GA4 setup
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Connect Google Analytics</h2>
        <p className="text-sm text-gray-500 mb-6">
          Link your GA4 property to see which YouTube keywords drive signups.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GA4 Property</label>
            {properties.length === 0 ? (
              <p className="text-sm text-gray-500">No GA4 properties found in your Google account.</p>
            ) : (
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                {properties.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.displayName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Event Name</label>
            <input
              type="text"
              value={conversionEvent}
              onChange={(e) => setConversionEvent(e.target.value)}
              placeholder="sign_up"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">The GA4 event that represents a signup (e.g. sign_up, generate_lead)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Website URL</label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://myapp.com"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Used to generate UTM tracking links for your video descriptions</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What's one signup worth? ($)</label>
            <input
              type="number"
              value={signupValue}
              onChange={(e) => setSignupValue(Number(e.target.value))}
              min={0}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Used to calculate YouTube ROI (e.g. average LTV or first purchase value)</p>
          </div>

          <button
            type="submit"
            disabled={!selectedProperty || !siteUrl}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
