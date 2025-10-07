import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FaGoogle, FaCopy, FaCheck } from 'react-icons/fa';

const GoogleLoginDiagnostic = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const runCompleteDiagnostic = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);
    const results = [];

    try {
      // Test 1: Environment Detection
      const isProduction = !window.location.hostname.includes('localhost');
      const currentOrigin = window.location.origin;
      const currentHostname = window.location.hostname;
      
      results.push({
        test: 'Environment Detection',
        status: 'info',
        message: `Running in ${isProduction ? 'Production' : 'Development'} mode`,
        details: {
          origin: currentOrigin,
          hostname: currentHostname,
          isProduction,
          protocol: window.location.protocol
        }
      });

      // Test 2: Environment Variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const hasEnvVars = !!(supabaseUrl && supabaseKey);
      
      results.push({
        test: 'Environment Variables',
        status: hasEnvVars ? 'success' : 'error',
        message: hasEnvVars ? 'Environment variables are properly set' : 'Environment variables are missing or undefined',
        details: {
          supabaseUrl: supabaseUrl || 'undefined',
          hasSupabaseKey: !!supabaseKey,
          allVarsSet: hasEnvVars
        }
      });

      // Test 3: Supabase Connection
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        results.push({
          test: 'Supabase Connection',
          status: !sessionError ? 'success' : 'warning',
          message: sessionError ? `Connection issue: ${sessionError.message}` : 'Connected to Supabase successfully',
          details: {
            sessionError: sessionError?.message || null,
            userError: userError?.message || null,
            hasSession: !!sessionData.session,
            hasUser: !!userData.user
          }
        });
      } catch (error: any) {
        results.push({
          test: 'Supabase Connection',
          status: 'error',
          message: `Connection failed: ${error.message}`,
          details: { error: error.message }
        });
      }

      // Test 4: OAuth URL Generation (without redirect)
      try {
        const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: isProduction 
              ? 'https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback'
              : `${currentOrigin}/auth/v1/callback`,
            skipBrowserRedirect: true
          }
        });

        results.push({
          test: 'OAuth URL Generation',
          status: !oauthError ? 'success' : 'error',
          message: oauthError ? `OAuth URL generation failed: ${oauthError.message}` : 'OAuth URL generated successfully',
          details: {
            error: oauthError?.message || null,
            hasUrl: !!oauthData?.url,
            url: oauthData?.url || null
          }
        });
      } catch (error: any) {
        results.push({
          test: 'OAuth URL Generation',
          status: 'error',
          message: `OAuth URL generation error: ${error.message}`,
          details: { error: error.message }
        });
      }

      // Test 5: Browser Environment
      const userAgent = navigator.userAgent;
      const isSecureContext = window.isSecureContext;
      const hasLocalStorage = typeof Storage !== 'undefined';
      
      results.push({
        test: 'Browser Environment',
        status: 'info',
        message: `Browser compatibility check`,
        details: {
          userAgent: userAgent,
          isSecureContext,
          hasLocalStorage,
          cookieEnabled: navigator.cookieEnabled,
          language: navigator.language
        }
      });

      // Test 6: Network Connectivity
      try {
        const response = await fetch('https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/health', {
          method: 'GET',
          mode: 'cors'
        });
        
        results.push({
          test: 'Network Connectivity',
          status: response.ok ? 'success' : 'warning',
          message: response.ok ? 'Can reach Supabase servers' : `Network issue: ${response.status}`,
          details: {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
          }
        });
      } catch (error: any) {
        results.push({
          test: 'Network Connectivity',
          status: 'error',
          message: `Network error: ${error.message}`,
          details: { error: error.message }
        });
      }

      // Test 7: Actual OAuth Attempt (with detailed logging)
      try {
        console.log('🧪 Testing actual OAuth flow...');
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: isProduction 
              ? 'https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback'
              : `${currentOrigin}/auth/v1/callback`
          }
        });

        results.push({
          test: 'Actual OAuth Flow',
          status: !error ? 'success' : 'error',
          message: error ? `OAuth failed: ${error.message}` : 'OAuth initiated successfully (check browser redirect)',
          details: {
            error: error?.message || null,
            errorCode: error?.status || null,
            hasData: !!data,
            redirectUrl: isProduction 
              ? 'https://dkjkuxbadylsquvrclnk.supabase.co/auth/v1/callback'
              : `${currentOrigin}/auth/v1/callback`
          }
        });
      } catch (error: any) {
        results.push({
          test: 'Actual OAuth Flow',
          status: 'error',
          message: `OAuth error: ${error.message}`,
          details: { error: error.message }
        });
      }

    } catch (error: any) {
      results.push({
        test: 'Diagnostic Error',
        status: 'error',
        message: `Diagnostic failed: ${error.message}`,
        details: { error: error.message }
      });
    }

    setDiagnosticResults(results);
    setIsRunning(false);
  };

  const copyResults = async () => {
    const diagnosticText = `Google Login Diagnostic Results
Generated: ${new Date().toISOString()}
URL: ${window.location.href}

${diagnosticResults.map(result => 
  `${result.test}: ${result.status.toUpperCase()}
  Message: ${result.message}
  Details: ${JSON.stringify(result.details, null, 2)}
  `
).join('\n')}

Please share this information for troubleshooting.`;

    try {
      await navigator.clipboard.writeText(diagnosticText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert('Failed to copy results. Please copy manually.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔬 Complete Google Login Diagnostic
        </CardTitle>
        <p className="text-sm text-gray-600">
          This comprehensive diagnostic will test every aspect of your Google login setup and identify the exact issue.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runCompleteDiagnostic} 
            disabled={isRunning}
            className="flex-1"
            size="lg"
          >
            {isRunning ? 'Running Diagnostic...' : 'Run Complete Diagnostic'}
          </Button>
          
          {diagnosticResults.length > 0 && (
            <Button 
              onClick={copyResults} 
              variant="outline"
              className="flex items-center gap-2"
            >
              {copied ? <FaCheck className="h-4 w-4 text-green-500" /> : <FaCopy className="h-4 w-4" />}
              Copy Results
            </Button>
          )}
        </div>

        {diagnosticResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Diagnostic Results:</h3>
            
            {/* Summary */}
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {diagnosticResults.filter(r => r.status === 'success').length}
                    </div>
                    <div className="text-sm text-gray-600">Success</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {diagnosticResults.filter(r => r.status === 'warning').length}
                    </div>
                    <div className="text-sm text-gray-600">Warning</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {diagnosticResults.filter(r => r.status === 'error').length}
                    </div>
                    <div className="text-sm text-gray-600">Error</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {diagnosticResults.filter(r => r.status === 'info').length}
                    </div>
                    <div className="text-sm text-gray-600">Info</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            {diagnosticResults.map((result, index) => (
              <Card key={index} className={`border-l-4 ${getStatusColor(result.status)}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getStatusIcon(result.status)}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{result.test}</div>
                      <div className="text-gray-700 mt-1">{result.message}</div>
                      
                      <details className="mt-3">
                        <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 font-medium">
                          View Technical Details
                        </summary>
                        <div className="mt-2">
                          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto border">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Next Steps</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Run the diagnostic above</li>
              <li>2. Check the results for any errors or warnings</li>
              <li>3. Copy the results and share them for detailed help</li>
              <li>4. Focus on fixing any "error" status items first</li>
              <li>5. Test Google login again after making fixes</li>
            </ol>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default GoogleLoginDiagnostic;
