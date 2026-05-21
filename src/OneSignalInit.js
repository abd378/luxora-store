import OneSignal from "react-onesignal";

export async function initOneSignal() {
  try {
    await OneSignal.init({
      appId: "b15fa5da-0313-4e6c-8a6f-9fca760eaec9",
      serviceWorkerPath: "/OneSignalSDKWorker.js",
      serviceWorkerParam: { scope: "/" },
      notifyButton: {
        enable: true,
      },
      allowLocalhostAsSecureOrigin: true,
    });

    console.log("OneSignal initialized");
  } catch (error) {
    console.log("OneSignal error:", error);
  }
}