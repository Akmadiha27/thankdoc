import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FaGoogle } from 'react-icons/fa';
import RedirectUriChecker from '@/components/RedirectUriChecker';
import GoogleLoginDiagnostic from '@/components/GoogleLoginDiagnostic';

const GoogleLoginTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (test: string, success: boolean, message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runAllTests = async () => {
    setTestResults([]);
    setIsLoading(true);

    // Test 1: Environment Variables
    addTestResult(
      'Environment Variables',
      !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
      import.meta.env.VITE_SUPABASE_URL ? 'Environment variables are set' : 'Environment variables missing',
      {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
      }
    );

    // Test 2: Supabase Connection
    try {
      const { data, error } = await supabase.auth.getSession();
      addTestResult(
        'Supabase Connection',
        !error,
        error ? `Connection failed: ${error.message}` : 'Connected to Supabase successfully',
        { data, error }
      );
    } catch (err) {
      addTestResult(
        'Supabase Connection',
        false,
        `Connection error: ${err}`,
        { error: err }
      );
    }

    // Test 3: Google OAuth - Method 1
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/v1/callback`,
          skipBrowserRedirect: true
        }
      });
      addTestResult(
        'Google OAuth (Method 1)',
        !error,
        error ? `OAuth failed: ${error.message}` : 'OAuth URL generated successfully',
        { data, error }
      );
    } catch (err) {
      addTestResult(
        'Google OAuth (Method 1)',
        false,
        `OAuth error: ${err}`,
        { error: err }
      );
    }

    // Test 4: Google OAuth - Method 2
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
          skipBrowserRedirect: true
        }
      });
      addTestResult(
        'Google OAuth (Method 2)',
        !error,
        error ? `OAuth failed: ${error.message}` : 'OAuth URL generated successfully',
        { data, error }
      );
    } catch (err) {
      addTestResult(
        'Google OAuth (Method 2)',
        false,
        `OAuth error: ${err}`,
        { error: err }
      );
    }

    // Test 5: Current Location Info
    addTestResult(
      'Location Info',
      true,
      'Current location details',
      {
        origin: window.location.origin,
        pathname: window.location.pathname,
        href: window.location.href,
        protocol: window.location.protocol,
        hostname: window.location.hostname
      }
    );

    setIsLoading(false);
  };

  const testActualGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/v1/callback`
        }
      });

      if (error) {
        addTestResult(
          'Actual Google Login',
          false,
          `Login failed: ${error.message}`,
          { error }
        );
      } else {
        addTestResult(
          'Actual Google Login',
          true,
          'Login initiated successfully',
          { data }
        );
      }
    } catch (err) {
      addTestResult(
        'Actual Google Login',
        false,
        `Login error: ${err}`,
        { error: err }
      );
    }
    setIsLoading(false);
  };

  const copyResults = () => {
    const resultsText = testResults.map(result => 
      `${result.test}: ${result.success ? '✅' : '❌'} ${result.message}\n${JSON.stringify(result.data, null, 2)}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(resultsText);
    alert('Test results copied to clipboard!');
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <GoogleLoginDiagnostic />
        
        <RedirectUriChecker />
        
        <Card>
          <CardHeader>
            <CardTitle>🔬 Google Login Diagnostic Tool</CardTitle>
            <p className="text-sm text-gray-600">
              This tool will test all aspects of your Google login setup and help identify issues.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Button 
                onClick={runAllTests} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Running Tests...' : 'Run All Tests'}
              </Button>
              <Button 
                onClick={testActualGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FaGoogle className="h-4 w-4" />
                Test Actual Login
              </Button>
              {testResults.length > 0 && (
                <Button onClick={copyResults} variant="secondary">
                  Copy Results
                </Button>
              )}
            </div>

            {testResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Test Results:</h3>
                {testResults.map((result, index) => (
                  <Card key={index} className={`border-l-4 ${result.success ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{result.test}</span>
                            <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                              {result.success ? '✅' : '❌'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                          <p className="text-xs text-gray-400 mt-1">Time: {result.timestamp}</p>
                        </div>
                      </div>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer">
                            View Details
                          </summary>
                          <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <strong>Environment Variables Missing:</strong> Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting platform
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <strong>Redirect URI Mismatch:</strong> Add your domain to Google Cloud Console and Supabase redirect URLs
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <strong>Provider Not Enabled:</strong> Enable Google provider in Supabase Dashboard with correct credentials
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <strong>Need Help?</strong> Copy the test results and share them for detailed troubleshooting
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleLoginTest;
