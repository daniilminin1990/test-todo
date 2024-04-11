import { AppDispatch } from "../../store/store";
import axios from "axios";
import { appActions } from "../../redux/appSlice";

export const handleServerNetworkError = (
  err: unknown,
  dispatch: AppDispatch
): void => {
  let errorMessage = "Some error occured";

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err);
  }
  dispatch(appActions.setAppError({ error: errorMessage }));
  dispatch(appActions.setAppStatus({ appStatus: "failed" }));
};
