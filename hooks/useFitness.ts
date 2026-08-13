import { useContext } from "react";
import { FitnessContext } from "@/store/FitnessProvider";

export function useFitness() {
  const value = useContext(FitnessContext);
  if (!value) throw new Error("useFitness must be used inside FitnessProvider");
  return value;
}
