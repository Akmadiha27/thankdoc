import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const GoogleLoginDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Collect debug information
    const info = {
      currentOrigin: window.location.origin,
      currentPath: window.location.pathname,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    setDebugInfo(info);
  }, []);

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('🔍 Supabase connection test:', { data, error });
      return { success: !error, data, error };
    } catch (err) {
      console.error('❌ Supabase connection failed:', err);
      return { success: false, error: err };
    }
  };

  const testGoogleOAuth = async () => {
    try {
      console.log('🧪 Testing Google OAuth...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/v1/callback`,
        },
      });

      console.log('🔍 OAuth response:', { data, error });
      return { success: !error, data, error };
    } catch (err) {
      console.error('❌ Google OAuth test failed:', err);
      return { success: false, error: err };
    }
  };

  const copyDebugInfo = () => {
    const debugString = JSON.stringify(debugInfo, null, 2);
    navigator.clipboard.writeText(debugString);
    alert('Debug info copied to clipboard!');
  };

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        🐛 Debug Google Login
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto z-50 bg-white shadow-lg border-2 border-orange-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">🐛 Google Login Debugger</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsVisible(false)}
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs space-y-1">
          <div><strong>Origin:</strong> {debugInfo.currentOrigin}</div>
          <div><strong>Path:</strong> {debugInfo.currentPath}</div>
          <div><strong>Supabase URL:</strong> {debugInfo.supabaseUrl || '❌ Missing'}</div>
          <div><strong>Supabase Key:</strong> {debugInfo.supabaseKey}</div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={testSupabaseConnection}
            className="text-xs"
          >
            Test Connection
          </Button>
          <Button 
            size="sm" 
            onClick={testGoogleOAuth}
            className="text-xs"
          >
            Test OAuth
          </Button>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={copyDebugInfo}
          className="text-xs w-full"
        >
          Copy Debug Info
        </Button>
        
        <div className="text-xs text-gray-500">
          Check browser console for detailed logs
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleLoginDebugger;
