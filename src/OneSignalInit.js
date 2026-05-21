import OneSignal from "react-onesignal";

export async function initOneSignal() {
  await OneSignal.init({
    appId: "b15fa5da-0313-4e6c-8a6f-9fca760eaec9",
    notifyButton: {
      enable: true,
    },
    allowLocalhostAsSecureOrigin: true,
  });
}