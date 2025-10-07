import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const RedirectUriChecker = () => {
  const [checks, setChecks] = useState<any[]>([]);

  const runChecks = () => {
    const newChecks = [];
    
    // Check 1: Environment Detection
    const isProduction = !window.location.hostname.includes('localhost');
    const currentOrigin = window.location.origin;
    const currentHostname = window.location.hostname;
    
    newChecks.push({
      name: 'Environment Detection',
      status: 'info',
      message: `Running in ${isProduction ? 'Production' : 'Development'} mode`,
      details: {
        origin: currentOrigin,
        hostname: currentHostname,
        isProduction
      }
    });

    // Check 2: Expected Redirect URL
    const expectedRedirectUrl = isProduction 
      ? 'https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback'
      : `${currentOrigin}/auth/v1/callback`;
    
    newChecks.push({
      name: 'Expected Redirect URL',
      status: 'success',
      message: `Should use: ${expectedRedirectUrl}`,
      details: {
        expectedUrl: expectedRedirectUrl,
        reason: isProduction 
          ? 'Production mode - using Supabase callback URL'
          : 'Development mode - using local callback URL'
      }
    });

    // Check 3: Required Google Cloud Console URIs
    const requiredGoogleUris = [
      'https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback',
      'http://localhost:5173/auth/v1/callback',
      'http://localhost:3000/auth/v1/callback'
    ];
    
    newChecks.push({
      name: 'Required Google Cloud Console URIs',
      status: 'warning',
      message: 'Make sure these URIs are in your Google Cloud Console:',
      details: {
        requiredUris: requiredGoogleUris,
        instructions: 'Go to Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client ID > Authorized redirect URIs'
      }
    });

    // Check 4: Supabase Configuration
    const requiredSupabaseUris = [
      currentOrigin,
      `${currentOrigin}/`,
      'https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    newChecks.push({
      name: 'Required Supabase Redirect URIs',
      status: 'warning',
      message: 'Make sure these URIs are in your Supabase Dashboard:',
      details: {
        requiredUris: requiredSupabaseUris,
        instructions: 'Go to Supabase Dashboard > Authentication > URL Configuration'
      }
    });

    setChecks(newChecks);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const copyResults = () => {
    const resultsText = checks.map(check => 
      `${check.name}: ${check.message}\n${JSON.stringify(check.details, null, 2)}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(resultsText);
    alert('Check results copied to clipboard!');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Redirect URI Configuration Checker
        </CardTitle>
        <p className="text-sm text-gray-600">
          This tool checks if your redirect URIs are configured correctly for Google OAuth.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runChecks} className="w-full">
          Run Configuration Checks
        </Button>
        
        {checks.length > 0 && (
          <>
            <Button onClick={copyResults} variant="outline" className="w-full">
              Copy Results
            </Button>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Check Results:</h3>
              {checks.map((check, index) => (
                <Card key={index} className={`border-l-4 ${getStatusColor(check.status)}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(check.status)}
                      <div className="flex-1">
                        <div className="font-medium">{check.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{check.message}</div>
                        
                        {check.details && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              View Details
                            </summary>
                            <div className="mt-2 space-y-2">
                              {check.details.requiredUris && (
                                <div>
                                  <div className="text-xs font-medium text-gray-700 mb-1">Required URIs:</div>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {check.details.requiredUris.map((uri: string, i: number) => (
                                      <li key={i} className="font-mono bg-gray-100 px-2 py-1 rounded">
                                        {uri}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {check.details.instructions && (
                                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                  💡 {check.details.instructions}
                                </div>
                              )}
                              
                              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                                {JSON.stringify(check.details, null, 2)}
                              </pre>
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RedirectUriChecker;
