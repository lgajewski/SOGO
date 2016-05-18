package pl.edu.agh.sogo;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.Length;
import com.mobsandgeeks.saripaar.annotation.Password;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import pl.edu.agh.sogo.android.R;

@SuppressWarnings("WeakerAccess")
public class LoginActivity extends Activity implements Validator.ValidationListener {

    private static final String TAG = LoginActivity.class.getSimpleName();

    @Length(min = 3, max = 32)
    @BindView(R.id.input_login)
    EditText loginText;

    @Password(min = 4)
    @BindView(R.id.input_password)
    EditText passwordText;

    @BindView(R.id.btn_login)
    Button loginButton;

    private Validator validator;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // ButterKnife
        ButterKnife.bind(this);

        validator = new Validator(this);
        validator.setValidationListener(this);
    }

    @OnClick(R.id.btn_login)
    public void login() {
        validator.validate();
    }

    @OnClick(R.id.logo)
    public void logo() {
        loginText.setText("username");
        passwordText.setText("password");
    }

    @Override
    public void onBackPressed() {
        // disable going back to the HomeActivity
        moveTaskToBack(true);
    }

    @Override
    public void onValidationSucceeded() {
        String login = loginText.getText().toString();
        String password = passwordText.getText().toString();

        // authentication logic
        new LoginTask(login, password).execute();
    }

    @Override
    public void onValidationFailed(List<ValidationError> errors) {
        for (ValidationError error : errors) {
            View view = error.getView();
            String message = error.getCollatedErrorMessage(this);

            // Display error messages
            if (view instanceof EditText) {
                ((EditText) view).setError(message);
            } else {
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
            }
        }
    }

    class LoginTask extends AsyncTask<Void, Void, Void> {

        private final String username;
        private final String password;
        private final SpinnerFragment mSpinnerFragment;
        private ProgressDialog progressDialog;

        public LoginTask(String username, String password) {
            this.username = username;
            this.password = password;
            mSpinnerFragment = new SpinnerFragment();
        }

        @Override
        protected void onPreExecute() {
            loginButton.setEnabled(false);

            progressDialog = new ProgressDialog(LoginActivity.this);
            progressDialog.setCancelable(false);
            progressDialog.setIndeterminate(true);
            progressDialog.setMessage(getResources().getString(R.string.logging));
            progressDialog.show();
        }

        @Override
        protected Void doInBackground(Void... voids) {
            try {
                Log.i(TAG, "Logging in..");

                Thread.sleep(3000);
            } catch (Exception e) {
                e.printStackTrace();
            }

            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            loginButton.setEnabled(true);
            progressDialog.dismiss();

            Intent intent = new Intent(getApplicationContext(), NavigationActivity.class);
            startActivity(intent);
        }
    }
}
