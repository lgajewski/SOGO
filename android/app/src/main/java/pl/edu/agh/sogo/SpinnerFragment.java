package pl.edu.agh.sogo;

import android.app.Fragment;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ProgressBar;

import pl.edu.agh.sogo.android.R;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;

/**
 * SpinnerFragment shows spinning progressbar to notify user that
 * application is processing something (while downloading, or preparing sth etc.)
 * <p/>
 * Example of usage in AsyncTask
 * + Start showing: OnPreExecute
 * mSpinnerFragment = new SpinnerFragment();
 * getFragmentManager().beginTransaction().add(R.id.some_view_group, mSpinnerFragment).commit();
 * + Stop showing: OnPostExecute
 * getFragmentManager().beginTransaction().remove(mSpinnerFragment).commit();
 */
public class SpinnerFragment extends Fragment {

    private static final int SPINNER_WIDTH = 100;
    private static final int SPINNER_HEIGHT = 100;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        
        FrameLayout frameLayout = new FrameLayout(container.getContext());
        frameLayout.setBackgroundColor(getResources().getColor(R.color.colorShadow));

        ProgressBar progressBar = new ProgressBar(container.getContext());
        FrameLayout.LayoutParams spinnerLp = new FrameLayout.LayoutParams(
                SPINNER_WIDTH, SPINNER_HEIGHT, Gravity.CENTER);
        frameLayout.addView(progressBar, spinnerLp);

        if (container instanceof FrameLayout) {
            FrameLayout.LayoutParams frameLp = new FrameLayout.LayoutParams(
                    MATCH_PARENT, MATCH_PARENT, Gravity.CENTER);
            frameLayout.setLayoutParams(frameLp);
        }

        return frameLayout;
    }
}