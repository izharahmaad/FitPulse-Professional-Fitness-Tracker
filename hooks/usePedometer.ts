import { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getHistoricalSteps, getPedometerStatus, requestPedometerPermission, subscribeToPedometer, PedometerStatus } from "@/services/pedometer";
import { dateKey } from "@/utils/date";
import { useFitness } from "@/hooks/useFitness";

export function usePedometer() {
  const { state, addSensorSteps } = useFitness();
  const [status, setStatus] = useState<PedometerStatus>({
    available: false,
    permissionGranted: false,
    message: "Checking activity sensor…"
  });

  const refresh = useCallback(async () => {
    const next = await getPedometerStatus();
    setStatus(next);
    return next;
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let mounted = true;

    const start = async () => {
      const current = await refresh();
      if (!mounted || !current.available || !current.permissionGranted) return;
      subscription = subscribeToPedometer(steps => addSensorSteps(steps));
    };

    void start();

    const listener = (next: AppStateStatus) => {
      if (next === "active") void start();
      if (next === "background" || next === "inactive") {
        subscription?.remove();
        subscription = null;
      }
    };

    const appStateSub = AppState.addEventListener("change", listener);
    return () => {
      mounted = false;
      subscription?.remove();
      appStateSub.remove();
    };
  }, [addSensorSteps, refresh]);

  const requestPermission = useCallback(async () => {
    const granted = await requestPedometerPermission();
    await refresh();
    return granted;
  }, [refresh]);

  const reconcileIosHistory = useCallback(async () => {
    const today = dateKey();
    const start = new Date(`${today}T00:00:00`);
    const now = new Date();
    const steps = await getHistoricalSteps(start, now);
    if (steps !== null) addSensorSteps(steps, true);
  }, [addSensorSteps]);

  return { status, requestPermission, reconcileIosHistory };
}
