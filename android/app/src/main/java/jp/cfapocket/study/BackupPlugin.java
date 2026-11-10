package jp.cfapocket.study;

import android.app.Activity;
import android.content.Intent;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

// Android's document picker: no storage permission or remote upload required.
@CapacitorPlugin(name = "Backup")
public class BackupPlugin extends Plugin {
    @PluginMethod
    public void save(PluginCall call) {
        String filename = call.getString("filename");
        String content = call.getString("content");
        if (filename == null || !filename.matches("cfa-pocket-[0-9-]+\\.json") || content == null) {
            call.reject("Invalid backup");
            return;
        }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, filename);
        startActivityForResult(call, intent, "documentCreated");
    }

    @ActivityCallback
    private void documentCreated(PluginCall call, ActivityResult result) {
        if (call == null) return;
        Intent data = result.getData();
        if (result.getResultCode() != Activity.RESULT_OK || data == null || data.getData() == null) {
            JSObject response = new JSObject();
            response.put("cancelled", true);
            call.resolve(response);
            return;
        }
        getBridge().execute(() -> {
            try (OutputStream stream = getContext().getContentResolver().openOutputStream(data.getData(), "wt")) {
                if (stream == null) throw new IllegalStateException("No document stream");
                stream.write(call.getString("content", "").getBytes(StandardCharsets.UTF_8));
                call.resolve();
            } catch (Exception error) {
                call.reject("Unable to save backup");
            }
        });
    }
}
