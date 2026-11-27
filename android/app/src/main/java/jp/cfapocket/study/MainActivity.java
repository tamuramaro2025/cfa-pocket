package jp.cfapocket.study;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BackupPlugin.class);
        super.onCreate(savedInstanceState);
        // Explicitly disable remote WebView inspection in release builds.
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
    }
}
